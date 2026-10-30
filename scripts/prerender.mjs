// Runs after `react-scripts build` (see "build" in package.json).
//
// For every page of the site it writes an HTML file with that page's title,
// description, canonical URL, social-preview tags, JSON-LD and a readable version
// of its content, so search engines, WhatsApp/Facebook link previews and AI
// crawlers that do not run JavaScript still see the page. The React app replaces
// that content as soon as it loads. It also writes sitemap.xml, 404.html and the
// .htaccess rules Hostinger needs (clean URLs, 301s from the old addresses, real 404s),
// and content.json: the services, therapists, articles and testimonials the app
// shows, served from the site itself so visitors never wait on Firestore.
//
// Content comes from Firestore's public REST API. If that cannot be reached, the
// committed scripts/content-snapshot.json is used instead.
//   node scripts/prerender.mjs                    prerender ./build
//   node scripts/prerender.mjs --update-snapshot  refresh the snapshot from Firestore

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faArrowRight, faBars } from '@fortawesome/free-solid-svg-icons'
import * as M from '../src/seo/meta.mjs'
import { fetchCollection } from '../src/seo/firestore.mjs'
import * as F from '../src/seo/finder.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = path.join(ROOT, 'build')
const SNAPSHOT = path.join(ROOT, 'scripts', 'content-snapshot.json')
const LEGACY = path.join(ROOT, 'scripts', 'legacy-paths.json')
const PROJECT = process.env.REACT_APP_projectId || 'the-sonder-hood'
const COLLECTIONS = ['services', 'therapists', 'blogs', 'testimonials']

// ---------------------------------------------------------------- content

async function fetchContent()
{
    const lists = await Promise.all(COLLECTIONS.map(name => fetchCollection(name, { project: PROJECT, signal: AbortSignal.timeout(60000) })))
    return Object.fromEntries(COLLECTIONS.map((name, i) => [name, lists[i]]))
}

async function loadContent()
{
    try
    {
        const content = await fetchContent()
        console.log(`prerender: content from Firestore (${content.services.length} services, ${content.therapists.length} therapists, ${content.blogs.length} articles, ${content.testimonials.length} testimonials)`)
        return content
    }
    catch (error)
    {
        console.warn(`prerender: Firestore unreachable (${error.message}); using scripts/content-snapshot.json`)
        return JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'))
    }
}

// Therapist and article photos live in Firebase Storage, which answers 402 while
// the project is on the Spark plan. Link previews and structured data must not
// point at images that fail, so they use the site image until the photos load.
async function dropUnreachablePhotos(content)
{
    const items = [...content.therapists, ...content.blogs]
    const isStorage = (src) => /firebasestorage\.googleapis\.com/i.test(src || '')
    const sample = items.map(item => item.image).find(isStorage)
    if (!sample) return
    let ok = false
    try
    {
        ok = (await fetch(sample, { signal: AbortSignal.timeout(15000) })).ok
    }
    catch
    {
        ok = false
    }
    if (ok) return
    console.warn('prerender: Firebase Storage photos do not load; link previews use the site image until they do')
    for (const item of items) if (isStorage(item.image)) item.image = undefined
}

// ---------------------------------------------------------------- HTML helpers

const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const json = (data) => JSON.stringify(data).replace(/</g, '\\u003c')
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`
const list = (items) => (items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : '')
// Plain copy with our contact details (and any `links`) as links, as src/components/LinkedText.js draws it.
const linked = (text, options) => M.linkedParts(text, options).map(part => (part.href ? link(part.href, part.text) : esc(part.text))).join('')
const paragraphs = (texts, options) => texts.filter(Boolean).map(text => `<p>${linked(text, options)}</p>`).join('')
const faqBlock = (faqs) => (faqs || []).filter(f => f && f.question)
    .map(f => `<details><summary>${esc(f.question)}</summary><p>${linked(f.answer, { links: f.links, word: true })}</p>${f.cta ? `<p>${link(f.cta.path, f.cta.label)}</p>` : ''}</details>`).join('')

function stripHead(html)
{
    return html
        .replace(/<title>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]*|twitter:[^"]*)"[^>]*>/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
        .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, '')
}

function preloadTags(preload = [])
{
    return preload.map(p => `<link rel="preload" as="image" href="${esc(p.href)}" media="${esc(p.media)}" fetchpriority="high"/>`).join('')
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

const NAV = [['/about', 'About'], ['/services', 'Services'], ['/therapists', 'Therapists'], ['/find-a-therapist', 'Find a therapist'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/book', 'Book a session']]

// A plain, styled version of the page (styles live in public/index.html). The
// React app replaces it on load; until then it is readable and every link works.
function shell(main, whatsappText)
{
    return `<div class="ssr">`
        + `<header class="ssr-head"><a class="ssr-brand" href="/">The Sonder Hood</a><nav class="ssr-nav" id="menu">${NAV.map(([href, text]) => link(href, text)).join('')}</nav></header>`
        + `<main class="ssr-main">${main}`
        + `<p class="ssr-cta"><a class="ssr-btn" href="${esc(M.whatsappUrl(whatsappText))}">Message us on WhatsApp</a> <a href="tel:${esc(M.SITE.phone)}">or call ${esc(M.SITE.phoneDisplay)}</a></p></main>`
        + `<footer class="ssr-foot"><nav class="ssr-nav">${M.SERVICE_LINKS.map(s => link(s.path, s.name)).join('')}</nav>`
        + `<p>${linked(`${M.SITE.name}, therapy center in ${M.SITE.address.display}`)} · Open ${esc(M.SITE.hours.display)} · Sessions in ${esc(M.sentenceList(M.sessionLanguages()))} · <a href="mailto:${esc(M.SITE.email)}">${esc(M.SITE.email)}</a> · ${link(M.SITE.mapsUrl, 'Directions')}</p></footer>`
        + `</div>`
}

// The cookie notice as the app draws it (src/components/ConsentBanner.js), on every
// page from the first paint. The script in public/index.html hides it when the visitor
// has already chosen, and its buttons store the choice before the app has loaded.
// Without it the notice appeared only with the app and, being the largest text on a
// phone's first screen, set the home page's "largest paint" seconds late.
const CONSENT_BANNER = `<div class="ConsentBanner ssr-consent" role="region" aria-label="Cookie choice">`
    + `<p>${esc(M.CONSENT_TEXT)} <a href="/privacy">Privacy policy</a></p>`
    + `<div class="ConsentBannerButtons"><button type="button" class="ConsentAccept" onclick="sonderhoodChoose('granted')">Accept</button><button type="button" class="ConsentDecline" onclick="sonderhoodChoose('denied')">No thanks</button></div>`
    + `</div>`

// A Font Awesome icon as the app draws it; the inline size stands in for the
// stylesheet Font Awesome adds only once the app runs.
function icon(definition, style)
{
    const [width, height, , , pathData] = definition.icon
    return `<svg aria-hidden="true" focusable="false" class="svg-inline--fa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="${style}"><path fill="currentColor" d="${pathData}"></path></svg>`
}

// The logo in the home page's top menu (src/components/HomePage/HomeHeader.js).
const HOME_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="76" viewBox="0 0 52 76" fill="none" role="img" aria-label="The Sonder Hood">'
    + '<path d="M22.7106 28.0581V27.8081H22.4606H20.9175H20.6675V28.0581V74.7204V74.9704H20.9175H22.4606H22.7106V74.7204V28.0581Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '<path d="M50.4778 27.2783V27.0283H50.2278H1.06226H0.812256V27.2783V28.8375V29.0875H1.06226H50.2278H50.4778V28.8375V27.2783Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '<path d="M11.414 28.0581V27.8081H11.164H9.62085H9.37085V28.0581V74.7204V74.9704H9.62085H11.164H11.414V74.7204V28.0581Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '<path d="M33.3318 27.3315L33.2431 27.0977L33.01 27.188L31.568 27.7467L31.3349 27.8371L31.4236 28.0708L49.2701 75.0949L49.3588 75.3286L49.5919 75.2383L51.0339 74.6796L51.267 74.5893L51.1783 74.3556L33.3318 27.3315Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '<path d="M0.75 75.5V75.75H1H50.7494H50.9994H51V75.5H51.2494V25.7597C51.2494 11.6959 39.9244 0.25 25.9997 0.25C12.075 0.25 0.75 11.6959 0.75 25.7597V75.5ZM49.2069 25.7597V73.6908H2.79313V25.7597C2.79313 12.8274 13.2062 2.30918 26.0003 2.30918C38.7944 2.30918 49.2069 12.8268 49.2069 25.7597Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '<path d="M16.3506 14.9016C16.3506 20.2738 20.6759 24.6484 25.9997 24.6484C31.3228 24.6484 35.6487 20.2738 35.6487 14.9016C35.6487 9.5294 31.3228 5.15479 25.9997 5.15479C20.6765 5.15479 16.3506 9.5294 16.3506 14.9016ZM18.3937 14.9016C18.3937 10.6603 21.8089 7.21396 25.9997 7.21396C30.1911 7.21396 33.6056 10.6603 33.6056 14.9016C33.6056 19.1429 30.1911 22.5892 25.9997 22.5892C21.8083 22.5892 18.3937 19.1429 18.3937 14.9016Z" fill="#464834" stroke="#464834" stroke-width="0.5"/>'
    + '</svg>'

// The first screen of the home page: the photo, menu and booking panel, with the
// app's own classes (src/components/HomePage/Home.js and HomeHeader.js) in their
// finished state. Drawn into the HTML, the photo shows as soon as it arrives instead
// of after the app's JavaScript (the phone speed score's largest element); the app
// then takes over without replaying the entrance (Home.js). The phone menu button
// jumps to the plain menu below until the app's own menu works.
function homeHero()
{
    const anchor = (href, text) => `<div class="HomeHeaderAnchor">${link(href, text)}</div>`
    return `<div class="HomePageContainer" data-prerendered-hero="">`
        + `<a class="ssr-hero-menu" href="#menu" aria-label="Open menu">${icon(faBars, 'width:5vh;height:5vh;margin-left:5%')}</a>`
        + `<div class="HomeHeaderContainer">`
        + `<div class="HomeHeaderContent">${anchor('/', 'HOME')}${anchor('/about', 'ABOUT')}${anchor('/blog', 'BLOG')}${anchor('/services', 'OUR SERVICES')}</div>`
        + HOME_LOGO
        + `<div class="HomeHeaderContent">${anchor('/contact', 'CONTACT US')}${anchor('/book', 'REQUEST A BOOKING')}</div>`
        + `</div>`
        + `<div class="HomePage">`
        + `<div class="IVectors"><div class="IVector"></div><div class="IVector"></div><div class="IVectorTilted"></div></div>`
        + `<div class="HomePageBookSession">`
        + `<div class="HomePageBookSessionText"><h6>Your</h6> <h6>Safe</h6> <h6>Haven</h6></div>`
        // A form, so the button also works without JavaScript (the onclick only spares the
        // address its empty "?").
        + `<div class="HomePageBookSessionButton"><form action="/book" method="get" style="display:contents"><button type="submit" onclick="location.href='/book';return false">Request A Booking ${icon(faArrowRight, 'height:1em;width:0.875em;vertical-align:-0.125em;overflow:visible')}</button></form></div>`
        + `${link(F.FINDER_PATH, 'Not sure who to see? Find your therapist').replace('<a ', '<a class="HomePageFinderLink" ')}`
        + `<h1 class="HomePageHeadline">${esc(M.HOME_HEADLINE)}</h1>`
        + `</div></div></div>`
}

// ---------------------------------------------------------------- pages

function buildPages({ services: rawServices, therapists, blogs: rawBlogs })
{
    const services = M.mergeServices([...rawServices].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)), therapists)
    const blogs = M.mergeBlogs(rawBlogs)
    const therapistItem = (t) => `${link(`/therapists/${M.therapistSlug(t)}`, t.name)}, ${esc(String(t.position || '').trim())}`
    const blogItem = (b) => `${link(`/blog/${M.blogSlug(b)}`, b.title)} by ${esc(b.therapist)}. ${esc(b.description)}`
    const serviceItem = (s) => `${link(`/services/${s.slug}`, s.title)}: ${esc(s.description)}`
    const pages = []

    // The home page's heading is in its hero.
    pages.push({
        file: 'index.html',
        head: { ...M.PAGES.home, ld: M.homeLd() },
        body: homeHero() + shell(paragraphs([M.PAGES.home.description, M.INTROS.services])
            + `<h2>Our services</h2>${list(services.map(serviceItem))}`
            + `<h2>Meet the team</h2>${list(therapists.map(therapistItem))}`
            + `<h2>From our blog</h2>${list(blogs.map(blogItem))}`
            + `<h2>Frequently asked questions</h2>${faqBlock(M.HOME_FAQS)}`),
    })

    pages.push({
        path: '/about',
        head: { ...M.PAGES.about, ld: M.pageLd({ name: 'About Us', path: '/about' }) },
        body: shell(`<h1>About The Sonder Hood</h1>${paragraphs([M.PAGES.about.description, M.INTROS.therapists[0]])}<h2>Our team</h2>${list(therapists.map(therapistItem))}`),
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
                + paragraphs([service.description, service.seo?.intro], { word: true })
                + list((service.points || []).map(esc))
                + (team.length ? `<h2>Available therapists</h2>${list(team.map(therapistItem))}` : '')
                + (service.faqs?.length ? `<h2>Frequently asked questions</h2>${faqBlock(service.faqs)}` : ''),
            `Hello The Sonder Hood, I would like to book a session for ${service.title}.`),
        })
    }

    pages.push({
        path: '/therapists',
        head: { ...M.PAGES.therapists, ld: M.pageLd({ name: 'Our Therapists', path: '/therapists' }) },
        body: shell(`<h1>Our therapists</h1>${paragraphs(M.INTROS.therapists, { word: true })}${list(therapists.map(therapistItem))}`),
    })

    for (const therapist of therapists)
    {
        const meta = M.therapistMeta(therapist)
        const written = blogs.filter(b => M.legacySlug(b.therapist) === M.legacySlug(therapist.name))
        const credentials = M.sortCredentials(therapist.certificates)
            .map(c => esc(`${String(c.year || '').trim() ? `${String(c.year).trim()}: ` : ''}${String(c.title || '').trim()}${String(c.description || '').trim() ? `, ${String(c.description).trim()}` : ''}`))
        pages.push({
            path: meta.path,
            lastmod: therapist.updateTime,
            head: { ...meta, ld: M.therapistLd(therapist) },
            body: shell(`<h1>${esc(therapist.name)}</h1>`
                + paragraphs([`${String(therapist.position || '').trim()} at The Sonder Hood, New Cairo.`, `Sessions in ${M.sentenceList(M.therapistLanguages(therapist))}.`])
                + ((therapist.clientele || []).length ? `<p>Works with: ${esc(therapist.clientele.join(', '))}</p>` : '')
                + ((therapist.search || []).length ? `<p>Areas of focus: ${esc(therapist.search.join(', '))}</p>` : '')
                + (therapist.quote ? `<blockquote>${esc(therapist.quote)}</blockquote>` : '')
                + (credentials.length ? `<h2>Credentials</h2>${list(credentials)}` : '')
                + (written.length ? `<h2>Articles</h2>${list(written.map(blogItem))}` : ''),
            `Hello The Sonder Hood, I would like to book a session with ${therapist.name}.`),
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
        const byline = author ? link(`/therapists/${M.therapistSlug(author)}`, author.name) : esc(blog.therapist)
        const service = M.blogServiceLink(blog)
        pages.push({
            path: meta.path,
            lastmod: blog.updateTime,
            head: { ...meta, ld: M.blogLd(blog, author) },
            body: shell(`<p class="ssr-meta">${esc([blog.topic, String(blog.duration || '').trim()].filter(Boolean).join(' · '))}</p>`
                + `<h1>${esc(blog.title)}</h1><p class="ssr-meta">By ${byline}</p>`
                + `<div class="ssr-article">${blog.body || ''}</div>`
                + (service ? `<p><strong>Want to talk this through with a therapist? Read about our ${link(service.path, service.name)}.</strong></p>` : '')
                + `<h2>Read more</h2>${list(blogs.filter(b => b.id !== blog.id).map(blogItem))}`),
        })
    }

    pages.push({
        path: '/contact',
        head: { ...M.PAGES.contact, ld: M.pageLd({ name: 'Contact Us', path: '/contact' }) },
        body: shell(`<h1>Contact us</h1>${paragraphs(M.INTROS.contact, { word: true })}`
            + list([
                `WhatsApp: <a href="${esc(M.whatsappUrl())}">${esc(M.SITE.phoneDisplay)}</a>`,
                `Phone: <a href="tel:${esc(M.SITE.phone)}">${esc(M.SITE.phoneDisplay)}</a>`,
                `Email: <a href="mailto:${esc(M.SITE.email)}">${esc(M.SITE.email)}</a>`,
                `Address: ${link(M.SITE.mapsUrl, M.SITE.address.display)}`,
                `Opening hours: ${esc(M.SITE.hours.display)}`,
                `Languages: ${esc(M.languagesText())}`,
            ])),
    })

    pages.push({
        path: '/book',
        head: { ...M.PAGES.book, ld: M.pageLd({ name: 'Book a Session', path: '/book' }) },
        body: shell(`<h1>Book a therapy session</h1>${paragraphs([`${M.INTROS.book} ${M.SITE.phoneDisplay}.`])}`),
    })

    pages.push({
        path: M.PAGES.finder.path,
        head: { ...M.PAGES.finder, ld: M.pageLd({ name: 'Find Your Therapist', path: M.PAGES.finder.path }) },
        body: shell(`<h1>Find your therapist</h1>${paragraphs([M.INTROS.finder])}`
            + `<h2>What would you like help with?</h2>${list(F.FINDER_TOPICS.map(topic => esc(topic.label)))}`
            + `<h2>Who is the therapy for?</h2>${list(F.FINDER_FOR.map(option => esc(option.label)))}`
            + `<h2>Which language would you prefer?</h2>${list(F.FINDER_LANGUAGES.filter(option => option.id !== 'either').map(option => esc(option.label)))}`
            + `<h2>Our team</h2>${list(therapists.map(therapistItem))}`,
            'Hello The Sonder Hood, I would like help finding the right therapist.'),
    })

    pages.push({
        path: M.PAGES.privacy.path,
        head: { ...M.PAGES.privacy, ld: M.pageLd({ name: 'Privacy Policy', path: M.PAGES.privacy.path }) },
        body: shell(`<h1>Privacy policy</h1>${M.PRIVACY.map(section => `<h2>${esc(section.title)}</h2>${paragraphs(section.text)}`).join('')}`),
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
    // The old links were the display text with its spaces removed, frozen in
    // legacy-paths.json by Firestore id, so a later rename keeps them working.
    // [NC] covers any capitalization.
    const legacy = JSON.parse(fs.readFileSync(LEGACY, 'utf8'))
    for (const service of services) add(legacy.services[service.id] && `services/${legacy.services[service.id]}`, `/services/${M.decorateService(service).slug}`)
    for (const therapist of therapists)
    {
        // A profile someone else took over (M.TEAM_CHANGES): its earlier addresses
        // lead to the team page, not to the new therapist.
        const replaced = M.TEAM_CHANGES[therapist.id]?.replaces
        const target = replaced ? '/therapists' : `/therapists/${M.therapistSlug(therapist)}`
        add(legacy.therapists[therapist.id] && `therapists/${legacy.therapists[therapist.id]}`, target)
        if (replaced) add(`therapists/${replaced}`, target)
    }
    for (const blog of blogs) add(legacy.blogs[blog.id] && `ArticlePage/${legacy.blogs[blog.id]}`, `/blog/${M.blogSlug(blog)}`)

    return `# Generated by scripts/prerender.mjs on every build; edit that script, not this file.
Options -Indexes
<IfModule mod_negotiation.c>
Options -MultiViews
</IfModule>
DirectoryIndex index.html
ErrorDocument 404 /404.html

# Pages and data files are checked for a new version on every visit, so a new
# build shows at once. Files in /static carry a hash of their content in their
# name (main.1090a27b.js), so a changed file gets a new name and browsers may
# keep these for a year.
<IfModule mod_headers.c>
<FilesMatch "\\.(html|xml|json|txt)$">
Header set Cache-Control "no-cache"
</FilesMatch>
<FilesMatch "\\.[0-9a-f]{8,20}\\.(chunk\\.)?(js|css|woff2?|otf|ttf|jpe?g|png|svg|webp|mp4)$">
Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
RewriteEngine On

# Never serve version-control files (a Git deploy leaves a .git folder here)
RewriteRule (^|/)\\.git(/|$) - [F,L]

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
RewriteRule ^ - [F,L]

RewriteCond %{DOCUMENT_ROOT}/_pages/$1.html -f
RewriteRule ^(.+)$ /_pages/$1.html [L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Anything else matches no file, so the server answers 404 with /404.html. A
# service, therapist or article added in Firebase gets its page (and its place in
# content.json) at the next build.
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

    // Image preloads go straight after the viewport tag, ahead of the stylesheets, so
    // the home photo is requested first. Not before it: until a phone has read that tag
    // it takes the page to be 980px wide and fetches the computer photo as well.
    // The heading font (17 KB) is preloaded on every page, so headings are drawn in it
    // from the first paint: drawn first in a stand-in font, the home hero's "Haven" is
    // smaller than the app's copy, which then counted as the late largest paint for
    // visitors who see no cookie notice.
    const viewport = /<meta name="viewport"[^>]*>/i
    if (!viewport.test(template)) throw new Error('build/index.html has no <meta name="viewport">')
    const media = JSON.parse(fs.readFileSync(path.join(BUILD, 'asset-manifest.json'), 'utf8')).files
    const headingFont = media['static/media/raglika-6yzwq.woff2']
    if (!headingFont) throw new Error('asset-manifest.json lists no static/media/raglika-6yzwq.woff2')
    const fontPreload = `<link rel="preload" as="font" type="font/woff2" href="${esc(headingFont)}" crossorigin/>`
    const render = (head, body = '') => template
        .replace(viewport, (tag) => `${tag}${preloadTags(head.preload)}${fontPreload}`)
        .replace('</head>', () => `${headTags(head)}</head>`)
        .replace('<div id="root"></div>', () => `<div id="root">${CONSENT_BANNER}${body}</div>`)

    const content = await loadContent()
    if (Array.isArray(content.therapists)) content.therapists = M.applyTeamChanges(content.therapists)

    // Photo addresses Firebase Storage will not serve are dropped from the app's copy
    // too, so browsers show the initials tile without a failed request (and a console
    // error) per photo; the next build after Storage answers again keeps them. A
    // collection the snapshot lacks is left out, and src/app/content.js then reads it
    // from Firestore.
    await dropUnreachablePhotos(content)
    const missing = COLLECTIONS.filter(name => !Array.isArray(content[name]))
    if (missing.length) console.warn(`prerender: content.json has no ${missing.join(', ')}; the app reads them from Firestore`)
    fs.writeFileSync(path.join(BUILD, 'content.json'), JSON.stringify(Object.fromEntries(COLLECTIONS.filter(name => !missing.includes(name)).map(name => [name, content[name]]))))

    const pages = buildPages(content)

    // The home hero is a CSS background, which the browser finds only once the
    // stylesheet has loaded; preloading it makes it the first thing fetched.
    const home = pages.find(page => page.file === 'index.html')
    if (home && media['static/media/main.jpeg'] && media['static/media/mainmob.jpeg'])
    {
        home.head.preload = [
            { href: media['static/media/main.jpeg'], media: '(min-width: 769px)' },
            { href: media['static/media/mainmob.jpeg'], media: '(max-width: 768px)' },
        ]
    }

    fs.rmSync(path.join(BUILD, '_pages'), { recursive: true, force: true })
    for (const page of pages)
    {
        const file = path.join(BUILD, pageFile(page))
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, render({ ...page.head, path: page.path || '/' }, page.body))
    }

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
