import emailjs from '@emailjs/browser'
import { SITE, whatsappUrl } from '../seo/meta.mjs'
import { trackLead } from '../analytics'

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
    const digits = normalizePhone(phone)
    if (digits.startsWith('20')) return /^20(1[0125]\d{8}|[2-9]\d{7,8})$/.test(digits)
    return /^[1-9]\d{7,14}$/.test(digits)
}

// Phone numbers are kept as digits with the country code. Browsers often autofill an
// Egyptian number in its national form (01001234567), and people type a trunk 0 after
// +20, so both become 20 + the number. `country` is the field's selected country,
// react-phone-input-2's second onChange argument.
export function normalizePhone(phone, country)
{
    let digits = String(phone || '').replace(/\D/g, '')
    if (digits.startsWith('00')) digits = digits.slice(2)
    const egypt = !country || country.countryCode === 'eg'
    if (egypt && /^0(1[0125]\d{8}|[2-9]\d{7,8})$/.test(digits)) return `20${digits.slice(1)}`
    if (/^200(1[0125]\d{8}|[2-9]\d{7,8})$/.test(digits)) return `20${digits.slice(3)}`
    // Other countries' national form drops the same trunk 0, except Italy's (part of the number).
    if (!egypt && country.dialCode && !['it', 'sm', 'va'].includes(country.countryCode) && /^0[1-9]\d{6,13}$/.test(digits)) return `${country.dialCode}${digits.slice(1)}`
    return digits
}

// Opens a WhatsApp chat with the practice, message pre-filled. Must be called
// straight from a click handler so the new tab is not treated as a pop-up.
// `method` names the form for analytics (only the name, never the answers).
export function openWhatsApp(text, method = 'form')
{
    trackLead(method)
    const url = whatsappUrl(text)
    const opened = window.open(url, '_blank')
    if (opened) opened.opener = null
    else window.location.href = url
}

function phoneForMessage(number)
{
    return `+${normalizePhone(number)}`
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
    if (number) lines.push(`Phone: ${phoneForMessage(number)}`)
    if (email) lines.push(`Email: ${email}`)
    lines.push(`Session: ${location === 'Online' ? 'Online' : 'At the center in New Cairo'}`)
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
    if (number) lines.push(`Phone: ${phoneForMessage(number)}`)
    if (email) lines.push(`Email: ${email}`)
    lines.push('', String(message || '').trim())
    return lines.join('\n')
}
