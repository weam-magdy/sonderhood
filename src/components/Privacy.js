import React from 'react'
import PagesHeader from './PagesHeader/PagesHeader'
import useSeo from '../seo/useSeo'
import { PAGES, PRIVACY, pageLd } from '../seo/meta.mjs'

// /privacy: what the site collects. The button reopens the cookie notice.
export default function Privacy()
{
    useSeo({ ...PAGES.privacy, jsonLd: pageLd({ name: 'Privacy Policy', path: PAGES.privacy.path }) })

    return (
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage PrivacyPage'>
                <h1 className='AboutPageOurStoryTitle'>PRIVACY POLICY</h1>
                {PRIVACY.map(section => (
                    <section key={section.title}>
                        <h2>{section.title}</h2>
                        {section.text.map(text => <p key={text}>{text}</p>)}
                    </section>
                ))}
                <button type='button' className='FinderSend PrivacyButton' onClick={() => window.dispatchEvent(new Event('sonderhood:consent'))}>Change your cookie choice</button>
            </div>
        </div>
    )
}
