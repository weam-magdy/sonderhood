import React from 'react'
import { Link } from 'react-router-dom'
import PagesHeader from './PagesHeader/PagesHeader'
import useSeo from '../seo/useSeo'
import { PAGES, SERVICE_LINKS, SITE, whatsappUrl } from '../seo/meta.mjs'

// Shown while Firestore data for a deep page is on its way.
export function PageLoading()
{
    return (
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage'>
                <p className='SimplePageStatus'>Loading…</p>
            </div>
        </div>
    )
}

// Shown when Firestore could not be reached. No noindex here: a crawler that hits
// a passing network problem must not drop the page.
export function PageError()
{
    return (
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage'>
                <p className='SimplePageStatus'>We couldn't load this page. Please refresh, or message us on <a href={whatsappUrl()} target='_blank' rel='noopener noreferrer'>WhatsApp</a>.</p>
            </div>
        </div>
    )
}

export default function NotFound()
{
    useSeo({ ...PAGES.notFound, noindex: true })

    return (
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage'>
                <h1 className='AboutPageOurStoryTitle'>Page not found</h1>
                <p>The page you were looking for does not exist or has moved. These might help:</p>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/services'>Our services</Link></li>
                    {SERVICE_LINKS.map(service => <li key={service.path}><Link to={service.path}>{service.name}</Link></li>)}
                    <li><Link to='/therapists'>Our therapists</Link></li>
                    <li><Link to='/blog'>Blog</Link></li>
                    <li><Link to='/contact'>Contact us</Link></li>
                </ul>
                <p>Or message us on <a href={whatsappUrl()} target='_blank' rel='noopener noreferrer'>WhatsApp at {SITE.phoneDisplay}</a>.</p>
            </div>
        </div>
    )
}
