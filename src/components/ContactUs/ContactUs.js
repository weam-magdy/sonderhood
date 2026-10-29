import React, { useEffect, useRef, useState } from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import map from '../../imgs/map2.png'
import topleft from '../../imgs/topl.jpeg'
import botleft from '../../imgs/botl.jpeg'
import topright from '../../imgs/topr.jpeg'
import botright from '../../imgs/botr.jpeg'
import mid from '../../imgs/midpics.jpeg'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser';
import useTitle from '../../hooks/useTitle'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

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

    useEffect(() => {
        setVerifyName(NAME_REGEX.test(name))
    }, [name])

    useEffect(() => {
        setVerifyNumber(NUMBER_REGEX.test(number.replace(/\s/g, '')))
    }, [number])

    const canSend = [verifyName, verifyNumber, message.length, subject.length].every(Boolean)

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        if (canSend) {
            setSucc(true)
            setName('')
            setEmail('')
            setMessage('')
            setNumber('')
            //@ts-ignore
            emailjs.sendForm(process.env.REACT_APP_service_id, process.env.REACT_APP_template_id, form.current, process.env.REACT_APP_public_key)
                .then((result) => {

                }, (error) => {

                });
        }
        else {
            setErr(true)
        }
    }

    useEffect(() => {
        setErr(false)
    }, [name, email, message, number, subject])

    const error = (
        <div className='BookError'>
            <p> All Fields Must Be Filled!</p>
        </div>
    )

    const success = (
        <div className='BookError'>
            <p style={{ color: 'green' }}> Message Sent Successfully!</p>
        </div>
    )

    return (
        <>
            <div className='ContactUsPageContainer'>
                <PagesHeader />
                <div className='ContactUsPage'>
                    <div className='ContactUsPageOurStory'>
                        <div className='ContactUsPageOurStoryTitle'>
                            FIND US
                        </div>
                        <div className='ContactUsPageOurStoryDesc'>
                            <div className='ContactUsPageDescFirstPart'>
                                {/* Lorem ipsum dolor sit amet consectetur. Sed urna diam lacus cum. Facilisi quis fames suscipit malesuada. Tincidunt velit in dolor cursus cursus neque. Et turpis eget pellentesque vitae eu. Non nulla urna dictum pharetra pellentesque faucibus vel. */}
                            </div>
                            <div className='ContactUsPageDescSecPart'>
                                {/* Lorem ipsum dolor sit amet consectetur. Sed urna diam lacus cum. Facilisi quis fames suscipit malesuada. Tincidunt velit in dolor cursus cursus neque. Et turpis eget pellentesque vitae eu. Non nulla urna dictum pharetra pellentesque faucibus vel. */}
                            </div>
                        </div>
                    </div>
                    <div className='ContactUsContact'>
                        <div className='ContactUsContactMap'>
                            <div className='ContactUsContactMapImage'>
                                <Link to='https://maps.app.goo.gl/6ib172QZdKsUx8ja6?g_st=ic'><img src={map} alt='map' /></Link>
                            </div>
                            <div className='ContactUsContactMapInfo'>
                                Reach us out on<br />
                                Email: inquiries@the-sonderhood.com<br />
                                Cellular: +201094292553<br />
                            </div>
                        </div>
                        <div className='ContactUsContactMessage'>
                            <div className='ContactUsContactMessageContainer'>
                                <div className='ContactUsContactMessageTitle'>
                                    SEND US A MESSAGE
                                </div>
                                {err && error}
                                {succ && success}
                                {/*//@ts-ignore*/}
                                <form ref={form} className='ContactUsContactMessageInfo'>
                                    <input hidden={true} value={number} name='number' />
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageName'>
                                        <label htmlFor='Name'>Full Name:</label>
                                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder='Name...' id='Name' type='text' name='name' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageEmail'>
                                        <label htmlFor='Email'>Email</label>
                                        <input onChange={(e) => setEmail(e.target.value)} value={email} name='email' placeholder='Email...' id='Email' type='email' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageNumber'>
                                        <label >Number</label>
                                        <PhoneInput
                                            country={"eg"}
                                            enableSearch={true}
                                            value={number}
                                            onChange={(phone) => setNumber(phone)}
                                            specialLabel='Number: '
                                            inputStyle={{
                                                width: "75%",
                                                height: "100%",
                                                padding: '0%',
                                                background: "transparent",
                                                border: "1px solid #000",
                                                outline: "none",
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
                                        <input onChange={(e) => setSubject(e.target.value)} placeholder='Subject...' id='Subject' type='text' />
                                    </div>
                                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageMessage'>
                                        <label htmlFor='Send us a message'>Send us a message:</label>
                                        <textarea onChange={(e) => setMessage(e.target.value)} value={message} name='message' style={{ paddingTop: '2.5%', textIndent: '0%', paddingLeft: '2.5%', justifyContent: 'flex-start', alignItems: 'flex-start' }} placeholder='' id='Send us a message' />
                                    </div>
                                </form>
                                <div className='ContactUsContactMessageButton'>
                                    {/* <button onClick={() => navigate('/BookASession')}>BOOK A SESSION</button> */}
                                    <button onClick={sendEmail}>SEND MESSAGE</button>
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
                        {/* <button onClick={() => navigate('/RequestASession')}>REQUEST A BOOKING</button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
