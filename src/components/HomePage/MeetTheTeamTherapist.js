import React from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { therapistSlug } from '../../seo/meta.mjs'

export default function MeetTheTeamTherapist({ therapist })
{
    const services = (therapist.clientele || []).map((service) => <div key={service} className='MeetTheTeamItemProfItem'>{service}</div>)

    // if(therapist.name === 'Mirna Mostafa' || therapist.name === 'Leena Abdelgawad') return (<></>)

    return (
        <Link
            to={`/therapists/${therapistSlug(therapist)}`}
            className='MeetTheTeamItem'
        >
            <div className='MeetTheTeamItemImage'>
                <SafeImage src={therapist.image} alt={`${therapist.name}, ${String(therapist.position || 'therapist').trim()} at The Sonder Hood`} label={therapist.name} />
            </div>
            <div className='MeetTheTeamItemInfo'>
                <div className='MeetTheTeamItemName'>
                    {therapist.name}
                </div>
                <div className='MeetTheTeamItemDesc'>
                    {therapist.position}
                </div>
            </div>
            <div className='MeetTheTeamItemProf'>
                {services}
            </div>
        </Link>
    )
}
