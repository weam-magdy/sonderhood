import React from 'react'
import Therapist from '../HomePage/Therapist'
import { therapists } from '../therapists'

export default function AvailableTherapists({ selectedService }) 
{

    const filteredTherapists = therapists.filter(therapist => selectedService !== 'All Services' ? therapist.services.includes(selectedService) : therapist)
    const therapistsDisplay = filteredTherapists.map(therapist => <Therapist therapist={therapist} />)

    return (
        <div className='MeetTheTeamContainer'>
            <div className='MeetTheTeamHeader'>
                <div className='MeetTheTeamHeaderContainer'>
                    <div className='MeetTheTeamHeaderTitle'>
                        <h1>AVAILABLE <span>TEHERAPISTS</span></h1>
                    </div>
                    <div className='MeetTheTeamHeaderDesc'>
                        Lorem ipsum dolor sit amet consectetur. Sed urna diam lacus cum. Facilisi quis fames suscipit malesuada. Tincidunt velit in dolor cursus cursus neque. Et turpis eget pellentesque vitae eu. Non nulla urna dictum pharetra pellentesque faucibus vel.
                    </div>
                </div>
            </div>
            <div className='MeetTheTeamItemsContainer'>
                {therapistsDisplay}
            </div>
            <div className='MeetTheTeamItemsButtons'>
                    <button className='MeetTheTeamItemBookButton'>BOOK A SESSION</button>
                    <button className='MeetTheTeamItemContactButton'>CONTACT US</button>
            </div>
        </div>
    )
}
