import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import HomePage from './components/HomePage/HomePage';
import Layout from './components/HomePage/Layout';
import About from './components/About/About';
import Services from './components/Services/Services';
import Service from './components/Services/Service';
import ContactUs from './components/ContactUs/ContactUs';
import { AnimatePresence } from 'framer-motion';
import Therapist from './components/TherapistProfile/Therapist';
import TherapistsPage from './components/TherapistProfile/TherapistsPage';
import Blogs from './components/Blogs/Blogs';
import Article from './components/Blogs/Article';
// import BookSession from './components/Booking/BookSession';
import RequestSession from './components/Booking/RequestSession';
import FindTherapist from './components/Finder/FindTherapist';
import Privacy from './components/Privacy';
import NewCairo from './components/NewCairo';
import NotFound from './components/PageStatus';
import { fetchTherapists } from './app/therapists/therapistsSlice';
import { fetchServices } from './app/services/servicesSlice';
import { fetchBlogs } from './app/blogs/blogsSlice';
import { fetchTestimonials } from './app/testimonials/testimonialsSlice';

function App()
{
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTherapists())
        dispatch(fetchServices())
        dispatch(fetchBlogs())
        dispatch(fetchTestimonials())
    }, [dispatch])

    // Paths match case-insensitively, so /About and /Services/... still land here.
    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.key}>
                <Route path='/' element={<Layout />}>
                    <Route index element={<HomePage />} />

                    <Route path='about' element={<About />} />

                    <Route path='services'>
                        <Route index element={<Services />} />
                        <Route path=':service' element={<Service />} />
                    </Route>

                    <Route path='therapists'>
                        <Route index element={<TherapistsPage />} />
                        <Route path=':therapist' element={<Therapist />} />
                    </Route>

                    <Route path='blog'>
                        <Route index element={<Blogs />} />
                        <Route path=':slug' element={<Article />} />
                    </Route>

                    <Route path='contact' element={<ContactUs />} />
                    <Route path='book' element={<RequestSession />} />
                    <Route path='find-a-therapist' element={<FindTherapist />} />
                    <Route path='therapy-in-new-cairo' element={<NewCairo />} />
                    <Route path='privacy' element={<Privacy />} />

                    {/* Addresses used before October 2026. The server also answers them with 301s. */}
                    <Route path='blogs' element={<Navigate to='/blog' replace />} />
                    <Route path='ArticlePage/:title' element={<Article />} />
                    <Route path='contactus' element={<Navigate to='/contact' replace />} />
                    <Route path='requestasession' element={<Navigate to='/book' replace />} />
                    {/* <Route path='BookASession' element={<BookSession />} /> */}

                    <Route path='*' element={<NotFound />} />
                </Route>

            </Routes>
        </AnimatePresence>
    )
}

export default App;
