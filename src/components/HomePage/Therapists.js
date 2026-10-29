import React from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../SafeImage'
import { therapistSlug } from '../../seo/meta.mjs'

export default function Therapists({ therapist })
{
    //eslint-disable-next-line
    const services = therapist?.clientele?.map(service =>
        {
            if(service !== 'All Services')
            {
                return (
                    <div key={service} className='MeetTheTeamItemProfItem'>
                            {service}
                    </div>
                )
            }
        }
    )

    // if(therapist.name === 'Mirna Mostafa' || therapist.name === 'Leena Abdelgawad') return (<></>)

    return (
        <>
        { therapist ?<Link to={`/therapists/${therapistSlug(therapist)}`} className='MeetTheTeamItem'>
            <div className='MeetTheTeamItemImage'>
                <SafeImage src={therapist.image} alt={`${therapist.name}, ${String(therapist.position || 'therapist').trim()} at The Sonderhood`} label={therapist.name} />
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
        :
        <div className='NoTherapists'>
            No Therapists Available
        </div>
        }
        </>
    )
}
