import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import WhatsAppButton from '../WhatsAppButton'

const SECTIONS = ['/about', '/services', '/therapists', '/blog', '/contact', '/book']

export default function Layout()
{
    const { pathname, search, hash } = useLocation()

    // One address per page: /About and /services/ become /about and /services.
    const canonical = pathname.toLowerCase().replace(/\/+$/, '') || '/'
    if (pathname !== canonical && SECTIONS.includes(canonical)) return <Navigate to={canonical + search + hash} replace />

    return (
        <>
            <Outlet />
            <Footer />
            <WhatsAppButton />
        </>
    )
}
