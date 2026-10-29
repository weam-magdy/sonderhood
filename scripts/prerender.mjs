// Runs after `react-scripts build` (see "build" in package.json).
//
// For every page of the site it writes an HTML file with that page's title,
// description, canonical URL, social-preview tags, JSON-LD and a readable version
// of its content, so search engines, WhatsApp/Facebook link previews and AI
// crawlers that do not run JavaScript still see the page. The React app replaces
// that content as soon as it loads. It also writes sitemap.xml, 404.html and the
// .htaccess rules Hostinger needs (clean URLs, 301s from the old addresses, real 404s).
//
// Content comes from Firestore's public REST API. If that cannot be reached, the
// committed scripts/content-snapshot.json is used instead.
//   node scripts/prerender.mjs                    prerender ./build
//   node scripts/prerender.mjs --update-snapshot  refresh the snapshot from Firestore

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as M from '../src/seo/meta.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = path.join(ROOT, 'build')
const SNAPSHOT = path.join(ROOT, 'scripts', 'content-snapshot.json')
const PROJECT = process.env.REACT_APP_projectId || 'the-sonder-hood'
const COLLECTIONS = ['services', 'therapists', 'blogs']

// ---------------------------------------------------------------- content

// Firestore REST values to plain JS, shaped like the browser SDK's doc.data():
// document references become { id } like a DocumentReference.
function plain(value)
{
    if ('stringValue' in value) return value.stringValue
    if ('integerValue' in value) return Number(value.integerValue)
    if ('doubleValue' in value) return value.doubleValue
    if ('booleanValue' in value) return value.booleanValue
    if ('nullValue' in value) return null
    if ('timestampValue' in value) return value.timestampValue
    if ('referenceValue' in value) return { id: value.referenceValue.split('/').pop() }
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(plain)
    if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([k, v]) => [k, plain(v)]))
    return null
}

async function fetchCollection(name)
{
    const docs = []
    let pageToken = ''
    do
    {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${name}?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}`
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
        if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
        const json = await response.json()
        for (const doc of json.documents || [])
        {
            docs.push({ ...plain({ mapValue: { fields: doc.fields || {} } }), id: doc.name.split('/').pop(), createTime: doc.createTime, updateTime: doc.updateTime })
        }
        pageToken = json.nextPageToken || ''
    } while (pageToken)
    return docs
}

async function fetchContent()
{
    const [services, therapists, blogs] = await Promise.all(COLLECTIONS.map(fetchCollection))
    return { services, therapists, blogs }
}

async function loadContent()
{
    try
    {
        const content = await fetchContent()
        console.log(`prerender: content from Firestore (${content.services.length} services, ${content.therapists.length} therapists, ${content.blogs.length} articles)`)
        return content
    }
    catch (error)
    {
        console.warn(`prerender: Firestore unreachable (${error.message}); using scripts/content-snapshot.json`)
        return JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'))
    }
}

// ---------------------------------------------------------------- HTML helpers

const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const json = (data) => JSON.stringify(data).replace(/</g, '\\u003c')
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`
const list = (items) => (items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : '')
const paragraphs = (texts) => texts.filter(Boolean).map(text => `<p>${esc(text)}</p>`).join('')
const faqBlock = (faqs) => (faqs || []).filter(f => f && f.question).map(f => `<details><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`).join('')

function stripHead(html)
{
    return html
        .replace(/<title>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*>/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
        .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, '')
}

function headTags({ title, description, path: pagePath, image, type = 'website', noindex = false, ld })
{
    const url = pagePath ? M.absoluteUrl(pagePath) : ''
    const img = M.absoluteUrl(image || M.SITE.image)
    return [
        `<title>${esc(title)}</title>`,
        `<meta name="description" content="${esc(description)}"/>`,
        `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}"/>`,
        url && !noindex ? `<link rel="canonical" href="${esc(url)}"/>` : '',
        `<meta property="og:type" content="${esc(type)}"/>`,
        `<meta property="og:site_name" content="${esc(M.SITE.name)}"/>`,
        `<meta property="og:locale" content="en_US"/>`,
        `<meta property="og:title" content="${esc(title)}"/>`,
        `<meta property="og:description" content="${esc(description)}"/>`,
        url ? `<meta property="og:url" content="${esc(url)}"/>` : '',
        `<meta property="og:image" content="${esc(img)}"/>`,
        `<meta name="twitter:card" content="summary_large_image"/>`,
        `<meta name="twitter:title" content="${esc(title)}"/>`,
        `<meta name="twitter:description" content="${esc(description)}"/>`,
        `<meta name="twitter:image" content="${esc(img)}"/>`,
        `<script type="application/ld+json" id="ld-site">${json(M.organizationLd())}</script>`,
        ld ? `<script type="application/ld+json" id="ld-page" data-source="prerender" data-path="${esc(pagePath)}">${json(ld)}</script>` : '',
    ].filter(Boolean).join('')
}

const NAV = [['/about', 'About'], ['/services', 'Services'], ['/therapists', 'Therapists'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/book', 'Book a session']]

// A plain, styled version of the page (styles live in public/index.html). The
// React app replaces it on load; until then it is readable and every link works.
function shell(main, whatsappText)
{
    return `<div class="ssr">`
        + `<header class="ssr-head"><a class="ssr-brand" href="/">The Sonderhood</a><nav class="ssr-nav">${NAV.map(([href, text]) => link(href, text)).join('')}</nav></header>`
        + `<main class="ssr-main">${main}`
        + `<p class="ssr-cta"><a class="ssr-btn" href="${esc(M.whatsappUrl(whatsappText))}">Message us on WhatsApp</a> <a href="tel:${esc(M.SITE.phone)}">or call ${esc(M.SITE.phoneDisplay)}</a></p></main>`
        + `<footer class="ssr-foot"><nav class="ssr-nav">${M.SERVICE_LINKS.map(s => link(s.path, s.name)).join('')}</nav>`
        + `<p>${esc(M.SITE.name)}, therapy centre in ${esc(M.SITE.address.display)} · <a href="mailto:${esc(M.SITE.email)}">${esc(M.SITE.email)}</a> · ${link(M.SITE.mapsUrl, 'Directions')}</p></footer>`
        + `</div>`
}

// ---------------------------------------------------------------- pages

function buildPages({ services: rawServices, therapists, blogs })
{
    const services = M.mergeServices([...rawServices].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)), therapists)
    const therapistItem = (t) => `${link(`/therapists/${M.therapistSlug(t)}`, t.name)}, ${esc(String(t.position || '').trim())}`
    const blogItem = (b) => `${link(`/blog/${M.blogSlug(b)}`, b.title)} by ${esc(b.therapist)}. ${esc(b.description)}`
    const serviceItem = (s) => `${link(`/services/${s.slug}`, s.title)}: ${esc(s.description)}`
    const pages = []

    pages.push({
        file: 'index.html',
        head: { ...M.PAGES.home, ld: M.homeLd() },
        body: shell(`<h1>${esc(M.HOME_HEADLINE)}</h1>`
            + paragraphs([M.PAGES.home.description, M.INTROS.services])
            + `<h2>Our services</h2>${list(services.map(serviceItem))}`
            + `<h2>Meet the team</h2>${list(therapists.map(therapistItem))}`
            + `<h2>From our blog</h2>${list(blogs.map(blogItem))}`
            + `<h2>Frequently asked questions</h2>${faqBlock(M.HOME_FAQS)}`),
    })

    pages.push({
        path: '/about',
        head: { ...M.PAGES.about, ld: M.pageLd({ name: 'About Us', path: '/about' }) },
        body: shell(`<h1>About The Sonderhood</h1>${paragraphs([M.PAGES.about.description, M.INTROS.therapists[0]])}<h2>Our team</h2>${list(therapists.map(therapistItem))}`),
    })

    pages.push({
        path: '/services',
        head: { ...M.PAGES.services, ld: M.pageLd({ name: 'Services', path: '/services' }) },
        body: shell(`<h1>Our services</h1>${paragraphs([M.INTROS.services])}${list(services.map(serviceItem))}`),
    })

    for (const service of services)
    {
        const meta = M.serviceMeta(service)
        const team = (service.therapists || []).map(ref => therapists.find(t => t.id === ref.id)).filter(Boolean)
        pages.push({
            path: meta.path,
            lastmod: service.updateTime,
            head: { ...meta, ld: M.serviceLd(service) },
            body: shell(`<h1>${esc(service.title)}</h1>`
                + paragraphs([service.description, service.seo?.intro])
                + list((service.points || []).map(esc))
                + (team.length ? `<h2>Available therapists</h2>${list(team.map(therapistItem))}` : '')
                + (service.faqs?.length ? `<h2>Frequently asked questions</h2>${faqBlock(service.faqs)}` : ''),
            `Hello The Sonderhood, I would like to book a session for ${service.title}.`),
        })
    }

    pages.push({
        path: '/therapists',
        head: { ...M.PAGES.therapists, ld: M.pageLd({ name: 'Our Therapists', path: '/therapists' }) },
        body: shell(`<h1>Our therapists</h1>${paragraphs(M.INTROS.therapists)}${list(therapists.map(therapistItem))}`),
    })

    for (const therapist of therapists)
    {
        const meta = M.therapistMeta(therapist)
        const written = blogs.filter(b => M.legacySlug(b.therapist) === M.legacySlug(therapist.name))
        const credentials = [...(therapist.certificates || [])]
            .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
            .map(c => esc(`${c.year ? `${c.year}: ` : ''}${c.title}`))
        pages.push({
            path: meta.path,
            lastmod: therapist.updateTime,
            head: { ...meta, ld: M.therapistLd(therapist) },
            body: shell(`<h1>${esc(therapist.name)}</h1>`
                + paragraphs([`${String(therapist.position || '').trim()} at The Sonderhood, New Cairo.`])
                + ((therapist.clientele || []).length ? `<p>Works with: ${esc(therapist.clientele.join(', '))}</p>` : '')
                + ((therapist.search || []).length ? `<p>Areas of focus: ${esc(therapist.search.join(', '))}</p>` : '')
                + (therapist.quote ? `<blockquote>${esc(therapist.quote)}</blockquote>` : '')
                + (credentials.length ? `<h2>Credentials</h2>${list(credentials)}` : '')
                + (written.length ? `<h2>Articles</h2>${list(written.map(blogItem))}` : ''),
            `Hello The Sonderhood, I would like to book a session with ${therapist.name}.`),
        })
    }

    pages.push({
        path: '/blog',
        head: { ...M.PAGES.blog, ld: M.pageLd({ name: 'Blog', path: '/blog' }) },
        body: shell(`<h1>Our blog</h1>${paragraphs([M.PAGES.blog.description])}${list(blogs.map(blogItem))}`),
    })

    for (const blog of blogs)
    {
        const meta = M.blogMeta(blog)
        const author = M.findTherapistByName(therapists, blog.therapist)
        const byline = author ? link(`/therapists/${M.therapistSlug(author)}`, blog.therapist) : esc(blog.therapist)
        pages.push({
            path: meta.path,
            lastmod: blog.updateTime,
            head: { ...meta, ld: M.blogLd(blog, author) },
            body: shell(`<p class="ssr-meta">${esc([blog.topic, String(blog.duration || '').trim()].filter(Boolean).join(' · '))}</p>`
                + `<h1>${esc(blog.title)}</h1><p class="ssr-meta">By ${byline}</p>`
                + `<div class="ssr-article">${blog.body || ''}</div>`
                + `<h2>Read more</h2>${list(blogs.filter(b => b.id !== blog.id).map(blogItem))}`),
        })
    }

    pages.push({
        path: '/contact',
        head: { ...M.PAGES.contact, ld: M.pageLd({ name: 'Contact Us', path: '/contact' }) },
        body: shell(`<h1>Contact us</h1>${paragraphs(M.INTROS.contact)}`
            + list([
                `WhatsApp: <a href="${esc(M.whatsappUrl())}">${esc(M.SITE.phoneDisplay)}</a>`,
                `Phone: <a href="tel:${esc(M.SITE.phone)}">${esc(M.SITE.phoneDisplay)}</a>`,
                `Email: <a href="mailto:${esc(M.SITE.email)}">${esc(M.SITE.email)}</a>`,
                `Address: ${link(M.SITE.mapsUrl, M.SITE.address.display)}`,
            ])),
    })

    pages.push({
        path: '/book',
        head: { ...M.PAGES.book, ld: M.pageLd({ name: 'Book a Session', path: '/book' }) },
        body: shell(`<h1>Book a therapy session</h1>${paragraphs([`${M.INTROS.book} ${M.SITE.phoneDisplay}.`])}`),
    })

    return pages
}

// ---------------------------------------------------------------- server files

function regexEscape(text)
{
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function htaccess({ services, therapists, blogs })
{
    const moved = []
    const add = (oldPath, newPath) =>
    {
        if (!oldPath || oldPath.toLowerCase() === newPath.slice(1).toLowerCase()) return
        moved.push(`RewriteRule ^${regexEscape(oldPath)}/?$ ${newPath} [NC,R=301,L]`)
    }
    // The old links were the display text with its spaces removed; [NC] covers any capitalisation.
    for (const service of services) add(service.title && `services/${M.legacySlug(service.title)}`, `/services/${M.decorateService(service).slug}`)
    for (const therapist of therapists) add(therapist.name && `therapists/${M.legacySlug(therapist.name)}`, `/therapists/${M.therapistSlug(therapist)}`)
    for (const blog of blogs) add(blog.title && `ArticlePage/${M.legacySlug(blog.title)}`, `/blog/${M.blogSlug(blog)}`)

    return `# Generated by scripts/prerender.mjs on every build; edit that script, not this file.
Options -MultiViews -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
RewriteEngine On

# One address for the whole site: https://www.the-sonderhood.com
RewriteCond %{HTTP_HOST} ^(www\\.)?the-sonderhood\\.com$ [NC]
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^the-sonderhood\\.com$ [NC]
RewriteRule ^ https://www.the-sonderhood.com%{REQUEST_URI} [R=301,L]

# No /index.html and no trailing slashes in addresses (only when the visitor typed them)
RewriteCond %{THE_REQUEST} \\s/+index\\.html[\\s?]
RewriteRule ^index\\.html$ / [R=301,L]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [R=301,L]

# Addresses used before October 2026
RewriteRule ^About/?$ /about [R=301,L]
RewriteRule ^Services/?$ /services [R=301,L]
RewriteRule ^Therapists/?$ /therapists [R=301,L]
RewriteRule ^(Blogs|blogs|Blog)/?$ /blog [R=301,L]
RewriteRule ^(ContactUs|contactus|Contact)/?$ /contact [R=301,L]
RewriteRule ^(RequestASession|requestasession|BookASession|bookasession|Book)/?$ /book [R=301,L]
${moved.join('\n')}

# The prerendered pages are only served through their clean addresses
RewriteCond %{THE_REQUEST} \\s/+_pages[/?\\s] [NC]
RewriteRule ^ - [R=404,L]

RewriteCond %{DOCUMENT_ROOT}/_pages/$1.html -f
RewriteRule ^(.+)$ /_pages/$1.html [L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# A service, therapist or article added in Firebase after the last build:
# the app renders it until the next build prerenders it.
RewriteRule ^(services|therapists|blog)/[A-Za-z0-9-]+$ /_pages/_app.html [NC,L]

# Everything else is a real 404
RewriteRule ^ - [R=404,L]
</IfModule>
`
}

function sitemap(pages)
{
    const urls = pages
        .filter(page => !page.noindex)
        .map(page => `<url><loc>${esc(M.absoluteUrl(page.path || '/'))}</loc>${page.lastmod ? `<lastmod>${page.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

function pageFile(page)
{
    return page.file || path.join('_pages', `${page.path.slice(1)}.html`)
}

// ---------------------------------------------------------------- main

async function main()
{
    if (process.argv.includes('--update-snapshot'))
    {
        const content = await fetchContent()
        fs.writeFileSync(SNAPSHOT, `${JSON.stringify({ fetchedAt: new Date().toISOString(), ...content }, null, 2)}\n`)
        console.log(`prerender: wrote ${path.relative(ROOT, SNAPSHOT)}`)
        return
    }

    const templatePath = path.join(BUILD, 'index.html')
    if (!fs.existsSync(templatePath)) throw new Error('build/index.html not found: run react-scripts build first')
    const template = stripHead(fs.readFileSync(templatePath, 'utf8'))
    if (!template.includes('<div id="root"></div>')) throw new Error('build/index.html has no empty <div id="root"></div>')

    const render = (head, body = '') => template
        .replace('</head>', () => `${headTags(head)}</head>`)
        .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)

    const content = await loadContent()
    const pages = buildPages(content)

    fs.rmSync(path.join(BUILD, '_pages'), { recursive: true, force: true })
    for (const page of pages)
    {
        const file = path.join(BUILD, pageFile(page))
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, render({ ...page.head, path: page.path || '/' }, page.body))
    }

    // Shell for pages added after this build; the app fills in everything.
    fs.writeFileSync(path.join(BUILD, '_pages', '_app.html'), render({ title: M.SITE.name, description: M.PAGES.home.description }))

    const notFound = `<h1>Page not found</h1><p>The page you were looking for does not exist or has moved.</p>`
        + list([link('/', 'Home'), link('/services', 'Our services'), ...M.SERVICE_LINKS.map(s => link(s.path, s.name)), link('/therapists', 'Our therapists'), link('/blog', 'Blog'), link('/contact', 'Contact us')])
    fs.writeFileSync(path.join(BUILD, '404.html'), render({ ...M.PAGES.notFound, path: '', noindex: true }, shell(notFound)))

    fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), sitemap(pages))
    fs.writeFileSync(path.join(BUILD, '.htaccess'), htaccess(content))

    console.log(`prerender: ${pages.length} pages, sitemap.xml (${pages.length} URLs), 404.html and .htaccess written to build/`)
}

main().catch(error =>
{
    console.error(`prerender failed: ${error.message}`)
    process.exit(1)
})
