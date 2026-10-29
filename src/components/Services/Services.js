import React from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectAllServices } from '../../seo/selectors'
import WhySonderHoodSec from './WhySonderHoodSec'
import useSeo from '../../seo/useSeo'
import { INTROS, PAGES, pageLd } from '../../seo/meta.mjs'
const colors = ['#F9F3D0', '#FFDEB5', '#D6DCA2']

export default function Serives()
{
    useSeo({ ...PAGES.services, jsonLd: pageLd({ name: 'Services', path: PAGES.services.path }) })

    const services = useSelector(selectAllServices)

    const displayServices = services.map((service, index) =>
    {
        const number = Math.floor((index+1) / 10) === 0 ? `0${index+1}` : index+1
        return(
            <Link key={service.slug} to={`/services/${service.slug}`} className='OurServicesItemContainer' style={{ background: colors[index % colors.length], marginTop: '10%' }}>
                <div className='OurServicesItemNumber'>
                    {number}
                </div>
                <div className='OurServicesItemTitle'>
                    {service.title}
                </div>
                <div className='OurServicesItemBody'>
                    {service.description}
                </div>
            </Link>
        )
    })

    return (
        <>
        <motion.div exit={{ x: '-100vw' }} transition={{ duration: 0.5, ease: 'easeInOut', type: 'tween' }} className='ServicesPageContainer'>
            <PagesHeader />
            <div className='ServicesPage'>
                <div className='ServicesPageHeader'>
                    <h1 className='ServicesPageHeaderTitle'>
                        OUR SERVICES
                    </h1>
                </div>
                <p className='ServicesPageIntro'>
                    {INTROS.services}
                </p>
                <div className='ServicesPageItems'>
                    <div className='ServicesPageItemsTopPart'>
                        {displayServices}
                    </div>
                </div>
            </div>
        </motion.div>
        <WhySonderHoodSec />
        </>
    )
}
