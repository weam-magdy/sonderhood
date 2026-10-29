import React, { useEffect, useRef, useState } from 'react'
import HomeHeader from './HomeHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { HOME_HEADLINE } from '../../seo/meta.mjs'
import { FINDER_PATH } from '../../seo/finder.mjs'

// The build draws this hero into the home page's HTML (scripts/prerender.mjs), so on
// a first visit it is already on screen when the app starts. That first time the
// app shows it as it is, instead of hiding the text and sliding it in again.
let heroPrerendered = typeof document !== 'undefined' && !!document.querySelector('[data-prerendered-hero]')

export default function Home()
{
    const navigate = useNavigate()

    const [skipEntrance] = useState(() =>
    {
        const skip = heroPrerendered
        heroPrerendered = false
        return skip
    })

    const tiltedRef = useRef(null)
    const tiltedInView = useInView(tiltedRef, { once: true })

    const bookRef = useRef(null)
    const bookInView = useInView(bookRef, { once: true })

    const mainTiltedAnimation = useAnimation()
    const mainBookAnimation = useAnimation()

    // Already in their final state when the entrance is skipped; starting them anyway
    // briefly lifts the booking panel over the tilted bar on tablets.
    useEffect(() =>
    {
        if(tiltedInView && !skipEntrance) mainTiltedAnimation.start('final')
        //eslint-disable-next-line
    }, [tiltedInView])

    useEffect(() =>
    {
        if(bookInView && !skipEntrance) mainBookAnimation.start('visible')
        //eslint-disable-next-line
    }, [bookInView])

    return (
        <div className='HomePageContainer'>
            <HomeHeader />
            <div className='HomePage'>
                <div className='IVectors'>
                    <div className='IVector'></div>
                    <div className='IVector'></div>
                    <motion.div 
                        ref={tiltedRef}
                        variants={{
                            start: { transform: 'rotate(0deg)' },
                            final: { transform: 'rotate(-20deg)' }
                        }}
                        initial={skipEntrance ? 'final' : 'start'}
                        animate={mainTiltedAnimation}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className='IVectorTilted'
                    >
                    </motion.div>
                </div>
                <motion.div 
                    ref={bookRef} 
                    variants={{
                        hidden: { opacity: 0, x: 200 }, 
                        visible: { opacity: 1, x: 0 }
                    }}
                    initial={skipEntrance ? 'visible' : 'hidden'}
                    animate={mainBookAnimation}
                    transition={{ duration: 1, delay: 0.25 }}
                    className='HomePageBookSession'
                >
                    <div className='HomePageBookSessionText'>
                        <h6>Your</h6> <h6>Safe</h6> <h6>Haven</h6>
                    </div>
                    <div className='HomePageBookSessionButton'>
                        <button onClick={() => navigate('/book')}>Request A Booking <FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                    <Link to={FINDER_PATH} className='HomePageFinderLink'>Not sure who to see? Find your therapist</Link>
                    <h1 className='HomePageHeadline'>{HOME_HEADLINE}</h1>
                </motion.div>
            </div>
        </div>
    )
}
