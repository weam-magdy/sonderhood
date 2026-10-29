import { useEffect } from 'react'
import { SITE, absoluteUrl } from './meta.mjs'

function setMeta(attr, key, value)
{
    let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
    if (value == null)
    {
        if (tag) tag.remove()
        return
    }
    if (!tag)
    {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        document.head.appendChild(tag)
    }
    tag.setAttribute('content', value)
}

function setCanonical(href)
{
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!href)
    {
        if (link) link.remove()
        return
    }
    if (!link)
    {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
    }
    link.setAttribute('href', href)
}

function setJsonLd(json, path)
{
    let script = document.getElementById('ld-page')
    // A prerendered page already carries data built from Firestore at build time
    // (with publish dates the browser SDK does not expose), so keep it.
    if (script && script.dataset.source === 'prerender' && script.dataset.path === path) return
    if (!json)
    {
        if (script) script.remove()
        return
    }
    if (!script)
    {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'ld-page'
        document.head.appendChild(script)
    }
    script.dataset.source = 'app'
    script.dataset.path = path
    script.textContent = json
}

// Sets the title, description, canonical URL, social tags and JSON-LD for the
// current page. Pass nothing (no title) while the page's data is still loading.
export default function useSeo({ title, description, path, image, type = 'website', noindex = false, jsonLd } = {})
{
    const json = jsonLd ? JSON.stringify(jsonLd) : ''

    useEffect(() =>
    {
        if (!title) return
        const url = absoluteUrl(path || window.location.pathname)
        const img = absoluteUrl(image || SITE.image)

        document.title = title
        setMeta('name', 'description', description)
        setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
        setCanonical(noindex ? null : url)
        setMeta('property', 'og:type', type)
        setMeta('property', 'og:title', title)
        setMeta('property', 'og:description', description)
        setMeta('property', 'og:url', url)
        setMeta('property', 'og:image', img)
        setMeta('name', 'twitter:title', title)
        setMeta('name', 'twitter:description', description)
        setMeta('name', 'twitter:image', img)
        setJsonLd(json, path)
    }, [title, description, path, image, type, noindex, json])
}
