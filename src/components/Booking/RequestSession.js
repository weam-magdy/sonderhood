import React, { useState, useRef } from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import useSeo from '../../seo/useSeo';
import { INTROS, PAGES, SITE, pageLd, whatsappUrl } from '../../seo/meta.mjs';
import { bookingMessage, isValidName, isValidPhone, openWhatsApp, sendEmailCopy } from '../../utils/contact';
import PhoneInput from 'react-phone-input-2';

const days = ['Any day', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function BookSession()
{
    useSeo({ ...PAGES.book, jsonLd: pageLd({ name: 'Book a Session', path: PAGES.book.path }) })

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [day, setDay] = useState('Any day')
    const [prefWay, setPrefWay] = useState('WhatsApp')
    const [number, setNumber] = useState('')

    const [location, setLocation] = useState('At The Center')

    const [err, setErr] = useState(false)
    const [succ, setSucc] = useState(false)

    const changed = (setter) => (e) =>
    {
        setter(e.target.value)
        setErr(false)
        setSucc(false)
    }

    const form = useRef();

    const canRequest = isValidName(firstName) && isValidName(lastName) && isValidPhone(number)

    // Opens WhatsApp with the request filled in; the visitor only has to tap Send.
    const sendRequest = (e) => {
        e.preventDefault();
        if(canRequest)
        {
            openWhatsApp(bookingMessage({ firstName, lastName, number, email, location, day, reach: prefWay }))
            sendEmailCopy(process.env.REACT_APP_templateBook_id, form.current)
            setSucc(true)
            setFirstName('')
            setLastName('')
            setEmail('')
            setNumber('')
        }
        else
        {
            setErr(true)
        }
    };

    const daysOptions = days.map(day => <option value={day} key={day}>{day}</option>)

    const error = (
        <div className='BookError'>
            <p> Please enter your first and last name and a valid mobile number.</p>
        </div>
    )

    const success = (
        <div className='BookError'>
            <p style={{ color: 'green' }}> Your request is ready in WhatsApp. Tap Send to reach us.</p>
        </div>
    )

    return (
        <>
        <div className='BookSessionContainer'>
            <PagesHeader />
            <div className='BookSession'>
                <h1 className='BookSessionTitle'>
                    REQUEST TO BOOK A SESSION
                </h1>
                <p className='BookSessionNote'>
                    {INTROS.book} <a href={whatsappUrl()} target='_blank' rel='noopener noreferrer'>{SITE.phoneDisplay}</a>.
                </p>
                {err && error}
                {succ && success}
                <div className='BookSessionLocation'>
                    <div className='BookSessionLocationTitle'>
                        Location
                    </div>
                    <div className='BookSessionLocationButtons'>
                        <button type='button' className={location === 'Online' ? 'BookSessionLocationSelectedButton' : 'BookSessionLocationNotSelectedButton'} onClick={() => setLocation('Online')}>Online</button>
                        <button type='button' className={location === 'At The Center' ? 'BookSessionLocationSelectedButton' : 'BookSessionLocationNotSelectedButton'} onClick={() => setLocation('At The Center')}>At The Center</button>
                    </div>
                </div>
                {/*//@ts-ignore*/}
                <form ref={form} onSubmit={sendRequest} style={{ height: '40vh', gridTemplateRows: '1fr 1fr 1fr' }} className='BookSessionInfo'>
                    <input hidden={true} readOnly value={number} name='number' />
                    <input hidden={true} readOnly value={location} name='location' />
                    <div className='BookSessionInfoCredentials BookSessionInfoFirstName'>
                        <label htmlFor='FirstName'>First Name</label>
                        <input onChange={changed(setFirstName)} value={firstName} placeholder='First Name...' id='FirstName' type='text' name='firstname' autoComplete='given-name' />
                    </div>
                    <div className='BookSessionInfoCredentials BookSessionInfoLastName'>
                        <label htmlFor='LastName'>Last Name</label>
                        <input onChange={changed(setLastName)} value={lastName} placeholder='Last Name...' id='LastName' type='text' name='lastname' autoComplete='family-name' />
                    </div>
                    <div className='BookSessionInfoCredentials BookSessionInfoEmail'>
                        <label htmlFor='Email'>Email</label>
                        <input onChange={changed(setEmail)} value={email} placeholder='Email...' id='Email' type='email' name='email' autoComplete='email' />
                    </div>
                    <div className='ContactUsContactMessageCredentials ContactUsContactMessageNumber'>
                        <label >Mobile Number</label>
                        <PhoneInput
                            country={"eg"}
                            enableSearch={true}
                            value={number}
                            onChange={(phone) => { setNumber(phone); setErr(false); setSucc(false) }}
                            specialLabel='Number: '
                            inputStyle={{
                                width: "100%",
                                height: "100%",
                                padding: '0%',
                                background: "transparent",
                                border: "1px solid #90946B",
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
                                marginLeft: '15%'
                            }}
                        />
                        {/* <input onChange={(e) => setNumber(e.target.value)} placeholder='Number...' id='Number' type='tel' /> */}
                    </div>
                    <div className='BookSessionInfoCredentials BookSessionInfoEmail'>
                        <label htmlFor='Day'>Day</label>
                        <select onChange={changed(setDay)} value={day} id='Day' name='day'>
                            {daysOptions}
                        </select>
                    </div>
                    <div className='BookSessionInfoCredentials BookSessionInfoReach'>
                        <label htmlFor='Reach'>How Do We Reach You?</label>
                        <select onChange={changed(setPrefWay)} value={prefWay} id='Reach' name='Reach'>
                            <option value='WhatsApp'>WhatsApp</option>
                            <option value='Email'>Email</option>
                            <option value='Call'>Call</option>
                        </select>
                    </div>
                </form>
                <div className='BookSessionButton'>
                    <button onClick={sendRequest}>SEND ON WHATSAPP</button>
                </div>
            </div>
        </div>
        </>
    )
}
