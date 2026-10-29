import React, { useRef, useState } from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import topleft from '../../imgs/topl.jpeg'
import botleft from '../../imgs/botl.jpeg'
import topright from '../../imgs/topr.jpeg'
import botright from '../../imgs/botr.jpeg'
import mid from '../../imgs/midpics.jpeg'
import useSeo from '../../seo/useSeo'
import { INTROS, PAGES, SITE, languagesText, pageLd, whatsappUrl } from '../../seo/meta.mjs'
import { contactMessage, isValidName, isValidPhone, normalizePhone, openWhatsApp, sendEmailCopy } from '../../utils/contact'
import PhoneInput from "react-phone-input-2";
import FormNotice from '../FormNotice';
import "react-phone-input-2/lib/bootstrap.css";

export default function ContactUs() {
    useSeo({ ...PAGES.contact, jsonLd: pageLd({ name: 'Contact Us', path: PAGES.contact.path }) })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [number, setNumber] = useState('')
    const [subject, setSubject] = useState('')

    const [err, setErr] = useState(false)
    const [succ, setSucc] = useState(false)

    const changed = (setter) => (e) => {
        setter(e.target.value)
        setErr(false)
        setSucc(false)
    }

    const canSend = isValidName(name) && isValidPhone(number) && message.trim().length > 0 && subject.trim().length > 0

    const form = useRef();

    // Opens WhatsApp with the message filled in; the visitor only has to tap Send.
    const sendMessage = (e) => {
        e.preventDefault();
        if (canSend) {
            openWhatsApp(contactMessage({ name, number, email, subject, message }), 'contact_form')
            sendEmailCopy(process.env.REACT_APP_template_id, form.current)
            setSucc(true)
            setName('')
            setEmail('')
            setMessage('')
            setNumber('')
            setSubject('')
        }
        else {
            setErr(true)
        }
    }

    const error = (
        <FormNotice>
            <p> Please fill in your name, a valid number, a subject and your message.</p>
        </FormNotice>
    )

    const success = (
        <FormNotice>
            <p style={{ color: 'green' }}> Your message is ready in WhatsApp. Tap Send to reach us.</p>
        </FormNotice>
    )

    return (
        <>
            <div className='ContactUsPageContainer'>
                <PagesHeader />
                <div className='ContactUsPage'>
                    <div className='ContactUsPageOurStory'>
                        <h1 className='ContactUsPageOurStoryTitle'>
                            FIND US
                        </h1>
                        <div className='ContactUsPageOurStoryDesc'>
                            <div className='ContactUsPageDescFirstPart'>
                                {INTROS.contact[0]}
                            </div>
                            <div className='ContactUsPageDescSecPart'>
                                {INTROS.contact[1]}
                            </div>
                        </div>
                    </div>
                    <div className='ContactUsContact'>
                        <div className='ContactUsContactMap'>
                            <div className='ContactUsContactMapImage'>
                                <iframe
                                    title='Map: The Sonderhood at 3Sixty by LMD, New Cairo'
                                    src={SITE.mapsEmbedUrl}
                                    loading='lazy'
                                    referrerPolicy='no-referrer-when-downgrade'
                                    allowFullScreen
                                />
                                <a className='ContactUsMapLink' href={SITE.mapsUrl} target='_blank' rel='noopener noreferrer'>Open in Google Maps</a>
                            </div>
                            <div className='ContactUsContactMapInfo'>
                                <address className='ContactUsContactDetails'>
                                    Reach us out on<br />
                                    WhatsApp: <a href={whatsappUrl()} target='_blank' rel='noopener noreferrer'>{SITE.phoneDisplay}</a><br />
                                    Cellular: <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a><br />
                                    Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
                                    Address: <a href={SITE.mapsUrl} target='_blank' rel='noopener noreferrer'>{SITE.address.display}</a><br />
                                    Opening hours: {SITE.hours.display}<br />
                                    Languages: {languagesText()}<br />
                                </address>
                            </div>
                        </div>
                        <div className='ContactUsContactMessage'>
                            <div className='ContactUsContactMessageContainer'>
                                <h2 className='ContactUsContactMessageTitle'>
                                    SEND US A MESSAGE
                                </h2>
                                {err && error}
                                {succ && success}
                                {/*//@ts-ignore*/}
                                <form ref={form} onSubmit={sendMessage} className='ContactUsContactMessageInfo'>
                                    <input hidden={true} readOnly value={number} name='number' />
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageName'>
                                        <label htmlFor='Name'>Full Name:</label>
                                        <input onChange={changed(setName)} value={name} placeholder='Name...' id='Name' type='text' name='name' autoComplete='name' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageEmail'>
                                        <label htmlFor='Email'>Email</label>
                                        <input onChange={changed(setEmail)} value={email} name='email' placeholder='Email...' id='Email' type='email' autoComplete='email' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageNumber'>
                                        <label htmlFor='Phone'>Number</label>
                                        <PhoneInput
                                            country={"eg"}
                                            inputProps={{ id: 'Phone', name: 'phone', autoComplete: 'tel' }}
                                            enableSearch={true}
                                            value={number}
                                            onChange={(phone, country) => { setNumber(normalizePhone(phone, country)); setErr(false); setSucc(false) }}
                                            specialLabel='Number: '
                                            inputStyle={{
                                                width: "75%",
                                                height: "100%",
                                                padding: '0%',
                                                background: "transparent",
                                                border: "1px solid #000",
                                                boxSizing: "border-box",
                                                boxShadow: "none",
                                                color: "var(--Text, #90946B)",
                                                fontFamily: "Arial",
                                                fontStyle: "normal",
                                                fontWeight: "400",
                                                lineHeight: "100%",
                                                textIndent: "7%",
                                                borderRadius: '0',
                                                marginLeft: '20%'
                                            }}
                                        />
                                        {/* <input onChange={(e) => setNumber(e.target.value)} placeholder='Number...' id='Number' type='tel' /> */}
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageDOB'>
                                        <label htmlFor='Subject'>Subject:</label>
                                        <input onChange={changed(setSubject)} value={subject} placeholder='Subject...' id='Subject' type='text' name='subject' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageMessage'>
                                        <label htmlFor='Message'>Send us a message:</label>
                                        <textarea onChange={changed(setMessage)} value={message} name='message' style={{ paddingTop: '2.5%', textIndent: '0%', paddingLeft: '2.5%', justifyContent: 'flex-start', alignItems: 'flex-start' }} placeholder='' id='Message' />
                                    </div>
                                </form>
                                <div className='ContactUsContactMessageButton'>
                                    {/* <button onClick={() => navigate('/BookASession')}>BOOK A SESSION</button> */}
                                    <button onClick={sendMessage}>SEND ON WHATSAPP</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='OurSpaceContainer'>
                <div className='OurSpace'>
                    <div className='OurSpaceHeading'>
                        <h1>OUR <span>SPACE</span></h1>
                    </div>
                    <div className='OurSpaceImages'>
                        <div className='OurSpaceImagesLeft'>
                            <img src={topleft} alt='An hourglass and a candle on a wooden table at The Sonderhood' loading='lazy' />
                            <img src={botleft} alt='Refreshment shelves with a kettle and plants at The Sonderhood' loading='lazy' />
                        </div>
                        <div className='OurSpaceImagesMid'>
                            <img src={mid} alt='An armchair by a sunlit window in a therapy room at The Sonderhood, New Cairo' loading='lazy' />
                        </div>
                        <div className='OurSpaceImagesRight'>
                            <img src={topright} alt='A wooden wall clock in a therapy room at The Sonderhood' loading='lazy' />
                            <img src={botright} alt='A desk with a lamp, notebooks and plants at The Sonderhood' loading='lazy' />
                        </div>
                    </div>
                    <div className='OurSpaceButton'>
                        {/* <button onClick={() => navigate('/RequestASession')}>REQUEST A BOOKING</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
