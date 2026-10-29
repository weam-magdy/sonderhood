import React from 'react'
import Home from './Home';
import TherapyImportance from './TherapyImportance';
import OurServices from './OurServices';
import LookingForHelp from './LookingForHelp';
import WhySonderHood from './WhySonderHood';
import MeetTheTeam from './MeetTheTeam';
import OurBlog from './OurBlog';
import ClientsSay from './ClientsSay';
import FAQ from './FAQ';
import useSeo from '../../seo/useSeo';
import { PAGES, homeLd } from '../../seo/meta.mjs';

export default function HomePage() 
{
    useSeo({ ...PAGES.home, jsonLd: homeLd() })
    return (
        <>
            <Home />
            <TherapyImportance />
            <OurServices />
            <LookingForHelp />
            <WhySonderHood />
            <MeetTheTeam />
            <OurBlog />
            <ClientsSay />
            <FAQ />
        </>
    )
}
