import React, { useEffect, useRef, useState } from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import topleft from '../../imgs/topl.jpeg'
import botleft from '../../imgs/botl.jpeg'
import topright from '../../imgs/topr.jpeg'
import botright from '../../imgs/botr.jpeg'
import mid from '../../imgs/midpics.jpeg'
import emailjs from '@emailjs/browser'
import useTitle from '../../hooks/useTitle'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import './ContactUs.css'

const NAME_REGEX = /^[A-z]{2,24}\s[A-z]{2,24}/
const NUMBER_REGEX = /^[1-9]{1,3}[0][1][0125][0-9]{8}/

export default function ContactUs() {
    useTitle('Contact Us')

    const [name, setName] = useState('')
    const [verifyName, setVerifyName] = useState(false)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [number, setNumber] = useState('')
    const [verifyNumber, setVerifyNumber] = useState(false)
    const [subject, setSubject] = useState('')
    const [err, setErr] = useState(false)
    const [succ, setSucc] = useState(false)

    const form = useRef()

    useEffect(() => {
        setVerifyName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setVerifyNumber(NUMBER_REGEX.test(number.replace(/\s/g, '')))
    }, [number])

    const canSend = [verifyName, verifyNumber, message.length, subject.length].every(Boolean)

    const sendEmail = (e) => {
        e.preventDefault()
        if (canSend) {
            setSucc(true)
            setErr(false)
            setName('')
            setEmail('')
            setMessage('')
            setNumber('')
            setSubject('')
            emailjs.sendForm(
                process.env.REACT_APP_service_id,
                process.env.REACT_APP_template_id,
                form.current,
                process.env.REACT_APP_public_key
            )
        } else {
            setErr(true)
            setSucc(false)
        }
    }

    useEffect(() => {
        setErr(false)
    }, [name, email, message, number, subject])

    return (
        <>
            <div className="contact-page">
                <PagesHeader />

                <main className="contact-main">
                    <header className="contact-header">
                        <h1 className="contact-title">FIND US</h1>
                    </header>

                    <section className="contact-content">
                        {/* Message Form */}
                        <div className="contact-form-wrapper">
                            <h2 className="contact-form-title">SEND US A MESSAGE</h2>

                            {err && (
                                <div className="contact-alert contact-alert--error">
                                    All Fields Must Be Filled!
                                </div>
                            )}
                            {succ && (
                                <div className="contact-alert contact-alert--success">
                                    Message Sent Successfully!
                                </div>
                            )}

                            <form ref={form} className="contact-form">
                                <input type="hidden" value={number} name="number" />

                                <div className="contact-form-row">
                                    <div className="contact-field">
                                        <label htmlFor="name">Full Name:</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Name..."
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="contact-field">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="contact-form-row">
                                    <div className="contact-field contact-field--phone">
                                        <label>Number:</label>
                                        <PhoneInput
                                            country="eg"
                                            enableSearch={true}
                                            value={number}
                                            onChange={(phone) => setNumber(phone)}
                                        />
                                    </div>
                                    <div className="contact-field">
                                        <label htmlFor="subject">Subject:</label>
                                        <input
                                            id="subject"
                                            type="text"
                                            placeholder="Subject..."
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="contact-field contact-field--full">
                                    <label htmlFor="message">Send us a message:</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </form>

                            <div className="contact-submit">
                                <button type="button" onClick={sendEmail}>
                                    SEND MESSAGE
                                </button>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info">
                            <h3 className="contact-info-title">Reach us out on</h3>
                            <div className="contact-info-item">
                                <span className="contact-info-label">Cellular:{" "}</span>
                                <a href="tel:+201094292553">+201094292553</a>
                            </div>
                            <div className="contact-info-item">
                                <span className="contact-info-label">Email:{" "}</span>
                                <a href="mailto:inquiries@the-sonderhood.com">inquiries@the-sonderhood.com</a>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Our Space Gallery */}
            <div className='OurSpaceContainer'>
                <div className='OurSpace'>
                    <div className='OurSpaceHeading'>
                        <h1>OUR <span>SPACE</span></h1>
                    </div>
                    <div className='OurSpaceImages'>
                        <div className='OurSpaceImagesLeft'>
                            <img src={topleft} alt='tl' />
                            <img src={botleft} alt='bl' />
                        </div>
                        <div className='OurSpaceImagesMid'>
                            <img src={mid} alt='m' />
                        </div>
                        <div className='OurSpaceImagesRight'>
                            <img src={topright} alt='tr' />
                            <img src={botright} alt='br' />
                        </div>
                    </div>
                    <div className='OurSpaceButton'>
                    </div>
                </div>
            </div>
        </>
    )
}
