import React, { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvailableTherapists from './AvailableTherapists'
import FAQ from '../HomePage/FAQ'
import PagesHeader from '../PagesHeader/PagesHeader'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectServicesStatus } from '../../app/services/servicesSlice'
import { selectedTherapists } from '../../app/therapists/therapistsSlice'
import { selectAllServices } from '../../seo/selectors'
import useSeo from '../../seo/useSeo'
import { legacySlug, serviceLd, serviceMeta } from '../../seo/meta.mjs'
import NotFound, { PageError, PageLoading } from '../PageStatus'
import LinkedText from '../LinkedText'
import ServiceDetails from './ServiceDetails'

export default function Service()
{
    const { service } = useParams()
    const navigate = useNavigate()
    const services = useSelector(selectAllServices)
    const servicesStatus = useSelector(selectServicesStatus)
    const therapists = useSelector(selectedTherapists)

    const selectedService = services.find(serviceItem => serviceItem.slug === String(service).toLowerCase())
    // Old links such as /Services/CouplesTherapy
    const movedService = !selectedService && services.find(serviceItem => serviceItem.legacySlug === legacySlug(service))

    // Firestore stores references to therapist documents; resolve them against the loaded list.
    const availableTherapists = useMemo(() => (selectedService?.therapists || [])
        .map(therapist => therapists.find(data => data.id === therapist.id))
        .filter(Boolean), [selectedService, therapists])

    useSeo(selectedService ? { ...serviceMeta(selectedService), jsonLd: serviceLd(selectedService) } : {})

    if (movedService) return <Navigate to={`/services/${movedService.slug}`} replace />
    if (!selectedService)
    {
        if (servicesStatus === 'failed') return <PageError />
        if (servicesStatus === 'succeeded') return <NotFound />
        return <PageLoading />
    }

    const title = selectedService.title.split(' ')

    const selectedServiceTitle = title.map((text, index) => index === 0 ? text : <span key={index}> {text}</span>)

    const displayPoints = selectedService.points?.map((point, index) => <li key={index}> {point}</li>)

    return (
        <>
            <motion.div
                initial={{ x: '100vw' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
                className='SingleServicePageContainer'
            >
                <PagesHeader />
                <div className='SingleServicePage'>
                    <div className='SingleServicePageDetails'>
                        <div className='SingleServicePageHeader'>
                            <div className='SingleServicePageHeaderTitle'>
                                <h1>{selectedServiceTitle}</h1>
                            </div>
                            <div className='SingleServicePageHeaderDesc'>
                                {selectedService.description}
                            </div>
                            {selectedService.seo?.intro &&
                                <div className='SingleServicePageHeaderDesc SingleServicePageIntro'>
                                    <LinkedText text={selectedService.seo.intro} word />
                                </div>
                            }
                        </div>
                        <div className='SingleServicePagePoints'>
                            <ul>
                                {displayPoints}
                            </ul>
                        </div>
                        <div className='SingleServicePageBook'>
                            <button onClick={() => navigate('/book')} className='SingleServicePageBookButton'>REQUEST A BOOKING</button>
                        </div>
                    </div>
                    <div className='SingleServicePageShapes'>
                        <div className='IVectors'>
                            <div className='IVector'>

                            </div>
                            <div className='IVector'>

                            </div>
                            <div className='IVectorTilted'>

                            </div>
                        </div>
                        <div className='ICircles'>
                            <div className='ICircle'>

                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            <ServiceDetails sections={selectedService.details?.sections} updated={selectedService.details?.updated} />
            <AvailableTherapists availableTherapists={availableTherapists} />
            <FAQ faqs={selectedService.faqs} />
        </>
    )
}
