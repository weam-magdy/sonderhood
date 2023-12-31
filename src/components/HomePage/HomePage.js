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
import useTitle from '../../hooks/useTitle';

export default function HomePage() 
{
    useTitle('Home')
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
            <FAQ faqs={[]} />
        </>
    )
}
