import React, { useEffect, useRef } from 'react'
import HomeHeader from './HomeHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import { HOME_HEADLINE } from '../../seo/meta.mjs'

export default function Home() 
{
    const navigate = useNavigate()

    const tiltedRef = useRef(null)
    const tiltedInView = useInView(tiltedRef, { once: true })

    const bookRef = useRef(null)
    const bookInView = useInView(bookRef, { once: true })

    const mainTiltedAnimation = useAnimation()
    const mainBookAnimation = useAnimation()

    useEffect(() =>
    {
        if(tiltedInView) mainTiltedAnimation.start('final')
        //eslint-disable-next-line
    }, [tiltedInView])

    useEffect(() =>
    {
        if(bookInView) mainBookAnimation.start('visible')
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
                        initial='start'
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
                    initial='hidden'
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
                    <h1 className='HomePageHeadline'>{HOME_HEADLINE}</h1>
                </motion.div>
            </div>
        </div>
    )
}
