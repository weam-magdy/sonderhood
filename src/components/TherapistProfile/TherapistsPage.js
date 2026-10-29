import React from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import AboutMeetTheTeam from '../About/AboutMeetTheTeam'
import useSeo from '../../seo/useSeo'
import { INTROS, PAGES, pageLd } from '../../seo/meta.mjs'

// /therapists: the whole team on one page, for searches like "therapists in Cairo".
export default function TherapistsPage()
{
    useSeo({ ...PAGES.therapists, jsonLd: pageLd({ name: 'Our Therapists', path: PAGES.therapists.path }) })

    return (
        <>
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='SimplePage'>
                <h1 className='AboutPageOurStoryTitle'>OUR THERAPISTS</h1>
                {INTROS.therapists.map(text => <p key={text}>{text}</p>)}
            </div>
        </div>
        <AboutMeetTheTeam />
        </>
    )
}
