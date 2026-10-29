import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useAnimation, useInView } from 'framer-motion'
import { selectAllServices } from '../../seo/selectors'

const colors = ['#F9F3D0', '#FFDEB5', '#D6DCA2']
const MotionLink = motion(Link)

export default function OurServices()
{
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

    const services = useSelector(selectAllServices)

    const displayServices = services.map((service, index) =>
    {

        const number = Math.floor((index+1) / 10) === 0 ? `0${index+1}` : index+1
        return(
            <MotionLink
                key={service.slug}
                to={`/services/${service.slug}`}
                className='OurServicesItemContainer'
                style={{ background: colors[index % colors.length] }}
                variants={{
                    hidden: { opacity: 0, y: 300 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial='hidden'
                animate={mainRefAnimation}
                transition={{ duration: 0.75, delay: 0.25 }}
            >
                <div className='OurServicesItemNumber'>
                    {number}
                </div>
                <div className='OurServicesItemTitle'>
                    {service.title}
                </div>
                <div className='OurServicesItemBody'>
                    {service.description}
                </div>
            </MotionLink>
        )
    })

    return (
        <div className='OurServicesContainer'>
            <div className='OurServicesHeader'>
                <h1>OUR SERVICES</h1>
            </div>
            <div ref={ref} className='OurServicesItems'>
                {displayServices}
            </div>
        </div>
    )
}
