import React from 'react'
import Therapists from '../HomePage/Therapists'
import { useNavigate } from 'react-router-dom'
import { whatsappUrl } from '../../seo/meta.mjs'

export default function AvailableTherapists({ availableTherapists })
{
    const navigate = useNavigate()

    const therapistsDisplay = availableTherapists?.length
        ? availableTherapists.map(therapist => <Therapists key={therapist.id} therapist={therapist} />)
        : (
            <div className='NoTherapists'>
                <span>Message us on <a href={whatsappUrl()} target='_blank' rel='noopener noreferrer'>WhatsApp</a> and we will match you with the right therapist.</span>
            </div>
        )

    return (
        <div className='MeetTheTeamContainer'>
            <div className='MeetTheTeamHeader'>
                <div className='MeetTheTeamHeaderContainer'>
                    <div className='MeetTheTeamHeaderTitle'>
                        <h1>AVAILABLE <span>THERAPISTS</span></h1>
                    </div>
                    <div className='MeetTheTeamHeaderDesc'>
                        {/* Lorem ipsum dolor sit amet consectetur. Sed urna diam lacus cum. Facilisi quis fames suscipit malesuada. Tincidunt velit in dolor cursus cursus neque. Et turpis eget pellentesque vitae eu. Non nulla urna dictum pharetra pellentesque faucibus vel. */}
                    </div>
                </div>
            </div>
            <div className='MeetTheTeamItemsContainer'>
                {therapistsDisplay}
            </div>
            <div className='MeetTheTeamItemsButtons'>
                    <button onClick={() => navigate('/book')} className='MeetTheTeamItemBookButton'>REQUEST A BOOKING</button>
                    <button onClick={() => navigate('/contact')} className='MeetTheTeamItemContactButton'>CONTACT US</button>
            </div>
        </div>
    )
}
