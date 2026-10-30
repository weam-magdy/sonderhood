import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllServices } from '../seo/selectors'
import { selectedTherapists } from '../app/therapists/therapistsSlice'
import { DEFAULT_WHATSAPP_TEXT, DEFAULT_WHATSAPP_TEXT_AR, SERVICE_NAMES_AR, therapistSlug, whatsappUrl } from '../seo/meta.mjs'
import { browserArabic } from '../utils/contact'
import { whatsappGlyph } from '../imgs/WhatsAppIcon'

// Floating "chat on WhatsApp" button on every page. On a service or therapist
// page the pre-filled message names it, so the team knows what the visitor saw.
// The message is in Arabic when the visitor's browser is.
export default function WhatsAppButton()
{
    const { pathname } = useLocation()
    const services = useSelector(selectAllServices)
    const therapists = useSelector(selectedTherapists)

    const [, section, slug] = pathname.toLowerCase().split('/')
    const arabic = browserArabic()
    let text = arabic ? DEFAULT_WHATSAPP_TEXT_AR : DEFAULT_WHATSAPP_TEXT

    if (section === 'services' && slug)
    {
        const service = services.find(item => item.slug === slug)
        if (service && !arabic) text = `Hello The Sonder Hood, I would like to book a session for ${service.title}.`
        else if (service && SERVICE_NAMES_AR[slug]) text = `مرحبًا، أود حجز جلسة ${SERVICE_NAMES_AR[slug]}.`
    }
    else if (section === 'therapists' && slug)
    {
        const therapist = therapists.find(item => therapistSlug(item) === slug)
        if (therapist) text = arabic ? `مرحبًا، أود حجز جلسة مع ${therapist.name}.` : `Hello The Sonder Hood, I would like to book a session with ${therapist.name}.`
    }

    return (
        <a
            className='WhatsAppFloat'
            href={whatsappUrl(text)}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Chat with The Sonder Hood on WhatsApp'
            title='Chat with us on WhatsApp'
        >
            {whatsappGlyph}
        </a>
    )
}
