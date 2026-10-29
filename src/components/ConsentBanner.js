import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent } from '../analytics'
import { CONSENT_TEXT } from '../seo/meta.mjs'

// Asks whether Google Analytics may run. "Cookie settings" in the footer and the
// privacy page reopen it with a 'sonderhood:consent' event; it then takes keyboard
// focus and gives it back after the choice.
export default function ConsentBanner()
{
    const [open, setOpen] = useState(() => !getConsent())
    const acceptRef = useRef(null)
    const returnFocus = useRef(null)

    useEffect(() =>
    {
        const reopen = () =>
        {
            returnFocus.current = document.activeElement
            setOpen(true)
        }
        window.addEventListener('sonderhood:consent', reopen)
        return () => window.removeEventListener('sonderhood:consent', reopen)
    }, [])

    // Lifts the WhatsApp button above the banner on phones.
    useEffect(() =>
    {
        document.body.classList.toggle('ConsentOpen', open)
        if (open && returnFocus.current) acceptRef.current?.focus()
    }, [open])

    if (!open) return null

    const choose = (choice) =>
    {
        setConsent(choice)
        setOpen(false)
        const back = returnFocus.current
        returnFocus.current = null
        if (back && typeof back.focus === 'function') back.focus()
    }

    return (
        <div className='ConsentBanner' role='region' aria-label='Cookie choice'>
            <p>
                {CONSENT_TEXT} <Link to='/privacy'>Privacy policy</Link>
            </p>
            <div className='ConsentBannerButtons'>
                <button type='button' ref={acceptRef} className='ConsentAccept' onClick={() => choose('granted')}>Accept</button>
                <button type='button' className='ConsentDecline' onClick={() => choose('denied')}>No thanks</button>
            </div>
        </div>
    )
}
