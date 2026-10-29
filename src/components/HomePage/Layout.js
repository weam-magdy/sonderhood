import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import WhatsAppButton from '../WhatsAppButton'
import ConsentBanner from '../ConsentBanner'

const SECTIONS = ['/about', '/services', '/therapists', '/blog', '/contact', '/book', '/find-a-therapist', '/privacy']

export default function Layout()
{
    const { pathname, search, hash } = useLocation()

    // One address per page: /About and /services/ become /about and /services.
    const canonical = pathname.toLowerCase().replace(/\/+$/, '') || '/'
    if (pathname !== canonical && SECTIONS.includes(canonical)) return <Navigate to={canonical + search + hash} replace />

    return (
        <>
            {/* First in the tab order; it is fixed to the bottom of the screen. */}
            <ConsentBanner />
            <Outlet />
            <Footer />
            <WhatsAppButton />
        </>
    )
}
