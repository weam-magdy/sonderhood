import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MeetTheTeamTherapist from './MeetTheTeamTherapist'
import { useSelector } from 'react-redux'
import { selectedTherapists } from '../../app/therapists/therapistsSlice'
import { motion, useAnimation, useInView } from 'framer-motion'

export default function MeetTheTeam() 
{
    const therapists = useSelector(selectedTherapists)

    const navigate = useNavigate()

    const ref = useRef(null)
    const refInView = useInView(ref)

    const mainRefAnimation = useAnimation()

    useEffect(() =>
    {
        if(refInView) 
        {
            mainRefAnimation.start('visible')
        }
        else
        {
            mainRefAnimation.start('hidden')
        }
        //eslint-disable-next-line
    }, [refInView])

    const therapistsDisplay = therapists.map((therapist, index) => <MeetTheTeamTherapist key={therapist.id} index={index} therapist={therapist} />)

    return (
        <div className='MeetTheTeamContainer'>
            <div className='MeetTheTeamHeader'>
                <h1>MEET THE <span>TEAM</span></h1>
            </div>
            <motion.div 
                ref={ref} 
                className='MeetTheTeamItemsContainer'
                variants={{ 
                    hidden: { opacity: 0 }, 
                    visible: { opacity: 1 }
                }} 
                initial='hidden'
                animate={mainRefAnimation}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                {therapistsDisplay}
            </motion.div>
            <div className='MeetTheTeamItemsButtons'>
                    <button onClick={() => navigate('/book')} className='MeetTheTeamItemBookButton'>REQUEST A BOOKING</button>
                    <button onClick={() => navigate('/therapists')} className='MeetTheTeamItemContactButton'>ALL THERAPISTS</button>
            </div>
        </div>
    )
}
