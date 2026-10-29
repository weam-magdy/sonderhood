import emailjs from '@emailjs/browser'
import { SITE, whatsappUrl } from '../seo/meta.mjs'

// At least two characters and no digits or symbols, so names in any script
// (Arabic included) pass. A \p{L} class would add ~15 kB once Babel expands it.
const NAME_REGEX = /^[^0-9!"#$%&()*+,/:;<=>?@[\\\]^_`{|}~]{2,}$/

export function isValidName(name)
{
    return NAME_REGEX.test(String(name || '').trim())
}

// react-phone-input-2 gives digits with the country code, e.g. 201094292553.
// Egyptian numbers must be a real mobile or landline; other countries 8-15 digits.
export function isValidPhone(phone)
{
    const digits = String(phone || '').replace(/\D/g, '')
    if (digits.startsWith('20')) return /^20(0?1[0125]\d{8}|[2-9]\d{7,8})$/.test(digits)
    return /^\d{8,15}$/.test(digits)
}

// Opens a WhatsApp chat with the practice, message pre-filled. Must be called
// straight from a click handler so the new tab is not treated as a pop-up.
export function openWhatsApp(text)
{
    const url = whatsappUrl(text)
    const opened = window.open(url, '_blank')
    if (opened) opened.opener = null
    else window.location.href = url
}

// Also emails the form through EmailJS when its IDs are set in .env
// (REACT_APP_service_id, REACT_APP_public_key and the template id). Without them
// nothing is sent and WhatsApp stays the only channel.
export function sendEmailCopy(templateId, form)
{
    const serviceId = process.env.REACT_APP_service_id
    const publicKey = process.env.REACT_APP_public_key
    if (!serviceId || !publicKey || !templateId || !form) return Promise.resolve(false)
    return emailjs.sendForm(serviceId, templateId, form, publicKey).then(
        () => true,
        (error) =>
        {
            console.error('EmailJS could not send the form', error)
            return false
        }
    )
}

export function bookingMessage({ firstName, lastName, number, email, location, day, reach, therapist })
{
    const lines = [`Hello ${SITE.name}, I would like to request a session.`, '']
    lines.push(`Name: ${`${firstName || ''} ${lastName || ''}`.trim()}`)
    if (number) lines.push(`Phone: +${String(number).replace(/\D/g, '')}`)
    if (email) lines.push(`Email: ${email}`)
    lines.push(`Session: ${location === 'Online' ? 'Online' : 'At the centre in New Cairo'}`)
    if (therapist) lines.push(`Therapist: ${therapist}`)
    if (day) lines.push(`Preferred day: ${day}`)
    if (reach) lines.push(`Contact me by: ${reach}`)
    return lines.join('\n')
}

export function contactMessage({ name, number, email, subject, message })
{
    const lines = [`Hello ${SITE.name},`, '']
    if (subject) lines.push(`Subject: ${subject}`)
    lines.push(`Name: ${String(name || '').trim()}`)
    if (number) lines.push(`Phone: +${String(number).replace(/\D/g, '')}`)
    if (email) lines.push(`Email: ${email}`)
    lines.push('', String(message || '').trim())
    return lines.join('\n')
}
