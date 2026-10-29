import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAllServices } from '../seo/selectors'
import { selectedTherapists } from '../app/therapists/therapistsSlice'
import { DEFAULT_WHATSAPP_TEXT, therapistSlug, whatsappUrl } from '../seo/meta.mjs'
import { whatsappGlyph } from '../imgs/WhatsAppIcon'

// Floating "chat on WhatsApp" button on every page. On a service or therapist
// page the pre-filled message names it, so the team knows what the visitor saw.
export default function WhatsAppButton()
{
    const { pathname } = useLocation()
    const services = useSelector(selectAllServices)
    const therapists = useSelector(selectedTherapists)

    const [, section, slug] = pathname.toLowerCase().split('/')
    let text = DEFAULT_WHATSAPP_TEXT

    if (section === 'services' && slug)
    {
        const service = services.find(item => item.slug === slug)
        if (service) text = `Hello The Sonderhood, I would like to book a session for ${service.title}.`
    }
    else if (section === 'therapists' && slug)
    {
        const therapist = therapists.find(item => therapistSlug(item) === slug)
        if (therapist) text = `Hello The Sonderhood, I would like to book a session with ${therapist.name}.`
    }

    return (
        <a
            className='WhatsAppFloat'
            href={whatsappUrl(text)}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Chat with The Sonderhood on WhatsApp'
            title='Chat with us on WhatsApp'
        >
            {whatsappGlyph}
        </a>
    )
}
