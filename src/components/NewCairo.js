import React from 'react'
import { Link } from 'react-router-dom'
import PagesHeader from './PagesHeader/PagesHeader'
import useSeo from '../seo/useSeo'
import { NEW_CAIRO, PAGES, SITE, newCairoLd } from '../seo/meta.mjs'
import LinkedText from './LinkedText'
import ServiceDetails from './Services/ServiceDetails'
import FAQ from './HomePage/FAQ'

// /therapy-in-new-cairo: the center, for people looking for a therapist near them.
// The copy lives in src/seo/pageCopy.mjs. No map is embedded (Google Maps would then
// load on this page too, which the privacy policy does not list); the button opens it.
export default function NewCairo()
{
    useSeo({ ...PAGES.newCairo, jsonLd: newCairoLd() })

    return (
        <>
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage LocationPage'>
                <h1 className='AboutPageOurStoryTitle'>{NEW_CAIRO.h1}</h1>
                {NEW_CAIRO.intro.map(text => <p key={text}><LinkedText text={text} word /></p>)}
                <address className='LocationAddress'>
                    {SITE.name}, {SITE.address.display} · Open {SITE.hours.display}
                </address>
                <p className='LocationActions'>
                    <a className='FinderSend' href={SITE.mapsUrl} target='_blank' rel='noopener noreferrer'>Open in Google Maps</a>
                    <Link className='FinderBookWith' to='/find-a-therapist'>Find your therapist</Link>
                    <Link className='FinderBookWith' to='/book'>Request a booking</Link>
                </p>
            </div>
        </div>
        <ServiceDetails sections={NEW_CAIRO.sections} updated={NEW_CAIRO.updated} label='Our therapy center in New Cairo' />
        <FAQ faqs={NEW_CAIRO.faqs} />
        </>
    )
}
