import React from 'react'
import { Link } from 'react-router-dom'
import { linkedParts } from '../seo/meta.mjs'
import { chatUrl } from '../utils/contact'

// Plain copy with our WhatsApp number, the center's name, our email and any `links`
// as links (see linkedParts in seo/meta.mjs). Pages of this site open in the app,
// WhatsApp and the map in a new tab.
export default function LinkedText({ text, links, word = false })
{
    return linkedParts(text, { links, word, chat: chatUrl() }).map((part, index) =>
    {
        if (!part.href) return <React.Fragment key={index}>{part.text}</React.Fragment>
        if (part.href.startsWith('/')) return <Link key={index} to={part.href}>{part.text}</Link>
        if (part.href.startsWith('mailto:')) return <a key={index} href={part.href}>{part.text}</a>
        return <a key={index} href={part.href} target='_blank' rel='noopener noreferrer'>{part.text}</a>
    })
}
