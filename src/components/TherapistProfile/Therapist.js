import React, { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import PagesHeader from '../PagesHeader/PagesHeader'
import book from '../../imgs/mainmob.jpeg'
import { useSelector } from 'react-redux'
import { selectedTherapists, selectTherapistsStatus } from '../../app/therapists/therapistsSlice'
import { selectAllBlogs } from '../../seo/selectors'
import useSeo from '../../seo/useSeo'
import { TEAM_CHANGES, blogSlug, legacySlug, sentenceList, sortCredentials, therapistLanguages, therapistLd, therapistMeta, therapistSlug } from '../../seo/meta.mjs'
import { bookingMessage, isValidName, isValidPhone, normalizePhone, openWhatsApp, sendEmailCopy } from '../../utils/contact'
import PhoneInput from 'react-phone-input-2'
import SafeImage from '../SafeImage'
import FormNotice from '../FormNotice'
import NotFound, { PageError, PageLoading } from '../PageStatus'
const colors = ['#F9F3D0', '#FFDEB5', '#D6DCA2']
// const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// const therapyTypes = ['Individual Therapy', 'Group Therapy', 'Child Therapy']
// const slots = ['7:00AM-8:00AM', '7:00AM-8:00AM', '7:00AM-8:00AM', '7:00AM-8:00AM', '7:00AM-8:00AM', '7:00AM-8:00AM']
const days = ['Any day', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']


export default function Therapist()
{
    const therapists = useSelector(selectedTherapists)
    const therapistsStatus = useSelector(selectTherapistsStatus)
    const blogs = useSelector(selectAllBlogs)

    const { therapist } = useParams()

    const navigate = useNavigate()

    const [location, setLocation] = useState('At The Center')
    //eslint-disable-next-line
    // const [width, setWidth] = useState(window.innerWidth <= 900)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [day, setDay] = useState('Any day')
    const [prefWay, setPrefWay] = useState('WhatsApp')
    const [number, setNumber] = useState('')

    const [err, setErr] = useState(false)
    const [succ, setSucc] = useState(false)

    const form = useRef();

    const selectedTherapist = therapists.find(therapistProfile => therapistSlug(therapistProfile) === String(therapist).toLowerCase())
    // Old links such as /Therapists/WeaamElaidy
    const movedTherapist = !selectedTherapist && therapists.find(therapistProfile => legacySlug(therapistProfile.name) === legacySlug(therapist))
    // The address of a profile someone else took over leads to the team page.
    const replacedProfile = !selectedTherapist && Object.values(TEAM_CHANGES).some(change => change.replaces === String(therapist).toLowerCase())

    useSeo(selectedTherapist ? { ...therapistMeta(selectedTherapist), jsonLd: therapistLd(selectedTherapist) } : {})

    if (movedTherapist) return <Navigate to={`/therapists/${therapistSlug(movedTherapist)}`} replace />
    if (replacedProfile) return <Navigate to='/therapists' replace />
    if (!selectedTherapist)
    {
        if (therapistsStatus === 'failed') return <PageError />
        if (therapistsStatus === 'succeeded') return <NotFound />
        return <PageLoading />
    }

    const changed = (setter) => (e) =>
    {
        setter(e.target.value)
        setErr(false)
        setSucc(false)
    }

    const canRequest = isValidName(firstName) && isValidName(lastName) && isValidPhone(number)

    // Opens WhatsApp with the request filled in; the visitor only has to tap Send.
    const sendRequest = (e) => {
        e.preventDefault();
        if(canRequest)
        {
            openWhatsApp(bookingMessage({ firstName, lastName, number, email, location, day, reach: prefWay, therapist: selectedTherapist.name }), 'therapist_profile_form')
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

    const services = (selectedTherapist.clientele || []).map((service) => <div key={service} className='TherapistProfileService'>{service}</div>)

    const orderedCerts = sortCredentials(selectedTherapist.certificates)

    const certificates = orderedCerts.map((certificate, index) =>
        (
            <div key={index} className='OurServicesItemContainer' style={{ background: colors[index % colors.length] }}>
                <div className='OurServicesItemNumber'>
                    {certificate.year}
                </div>
                <div className='OurServicesItemTitle'>
                    {certificate.title}
                </div>
                <div className='OurServicesItemBody'>
                    {certificate.description}
                </div>
            </div>
        ))

    // Author names are typed by hand ("Ingie ElSaady"), so compare without spaces or case.
    const therapistBlogs = blogs.filter(blog => legacySlug(blog.therapist) === legacySlug(selectedTherapist.name))

    const displayedBlogs = therapistBlogs.map(blog =>
        (
            <Link to={`/blog/${blogSlug(blog)}`} key={blog.id} className='OurBlogItemContainer'>
                <div className='OurBlogItemImage'>
                    <SafeImage src={blog.image} alt={blog.title} />
                </div>
                <div className='OurBlogItemTitle'>
                    {blog.title}
                </div>
                <div className='OurBlogItemBody'>
                    {blog.description}
                </div>
            </Link>
        )
    )

    const error = (
        <FormNotice>
            <p> Please enter your first and last name and a valid mobile number.</p>
        </FormNotice>
    )

    const success = (
        <FormNotice>
            <p style={{ color: 'green' }}> Your request is ready in WhatsApp. Tap Send to reach us.</p>
        </FormNotice>
    )

    return (
        <>
        <div className='TherapistProfileContainer'>
            <PagesHeader />
            <div className='TherapistProfile'>
                <div className='TherapistProfileImage'>
                    <SafeImage src={selectedTherapist.image} alt={`${selectedTherapist.name}, ${String(selectedTherapist.position || 'therapist').trim()} at The Sonderhood in New Cairo`} label={selectedTherapist.name} loading='eager' />
                </div>
                <div className='TherapistProfileInfo'>
                    <h1 className='TherapistProfileName'>
                        {selectedTherapist.name}
                    </h1>
                    <div className='TherapistProfileDesc'>
                        {selectedTherapist.position}
                    </div>
                    <div className='TherapistProfileLanguages'>
                        Sessions in {sentenceList(therapistLanguages(selectedTherapist))}
                    </div>
                    <div className='TherapistProfileServices'>
                        {services}
                    </div>
                    <div className='TherapistProfileButton'>
                        <button onClick={() => navigate('/book')}>REQUEST A BOOKING</button>
                    </div>
                </div>
            </div>
        </div>
        {selectedTherapist.quote && <div className='TestimonialsContainer'>
            <div className='TestimonialsImage'>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.8286 0V10.9714C15.3264 10.9714 10.9186 11.1793 10.9184 21.1958V26.4H21.6V48H0V26.4V21.1958C0 13.3208 2.03795 7.47291 6.49047 3.81413C9.57054 1.28323 13.2195 0 17.8286 0ZM44.2286 0V10.9714C41.7264 10.9714 37.3186 11.1793 37.3184 21.1958V26.4H48V48H26.4V26.4V21.1958C26.4 13.3208 28.438 7.47291 32.8905 3.81413C35.9705 1.28323 39.6195 0 44.2286 0Z" fill="#464834"/>
                </svg>
            </div>
            <div className='TestimonialsText'>
                {selectedTherapist.quote}
            </div>
            <div className='TestimonialsDesc'>
                {/* Lorem ipsum dolor sit amet consectetur. Ut ullamcorper id pellentesque aenean libero. Lorem ipsum dolor sit amet consectetur. Ut ullamcorper id pellentesque aenean libero.  */}
            </div>
        </div>}
        <div className='OurServicesContainer'>
            <div className='OurServicesHeader'>
                <h1>CREDENTIALS</h1>
            </div>
            <div className='OurServicesItems'>
                {certificates}
            </div>
        </div>
        {
            selectedTherapist.name !== 'Leena Abdelgawad' &&
            <div className='OurBlogContainer'>
                <div className='OurBlogHeader'>
                    <h1>BLOGS</h1>
                </div>
                <div className='OurBlogItems'>
                    {therapistBlogs.length ? displayedBlogs : (
                        <div style={{ marginRight: '7.5%' }} className='NoTherapists'>
                            No Blogs Available
                        </div>
                    )}
                </div>
                <div className='OurBlogItemsButtons'>
                    <button onClick={() => navigate('/blog')} className='OurBlogItemBookButton'>SEE ALL BLOGS</button>
                </div>
            </div>
        }
        <div className='TherapistBookSession'>
            <div className='TherapistBookSessionImage'>
                <img src={book} alt='A calm therapy room at The Sonderhood' loading='lazy' />
            </div>
            <div className='BookSession'>
                <h2 className='BookSessionTitle'>
                    REQUEST TO BOOK A SESSION
                </h2>
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
                    <input hidden={true} readOnly value={location} name='location' />
                    <input hidden={true} readOnly value={number} name='number' />
                    <input hidden={true} readOnly value={selectedTherapist.name} name='therapist' />
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
                    <div style={{ gridColumn: '3 / span 2' }} className='BookSessionInfoCredentials BookSessionInfoTherapist'>
                        <label htmlFor='Phone'>Mobile Number</label>
                        <PhoneInput
                            country={"eg"}
                            inputProps={{ id: 'Phone', name: 'phone', autoComplete: 'tel' }}
                            enableSearch={true}
                            value={number}
                            onChange={(phone, country) => { setNumber(normalizePhone(phone, country)); setErr(false); setSucc(false) }}
                            specialLabel='Number: '
                            inputStyle={{
                                width: "100%",
                                height: "100%",
                                padding: '0%',
                                background: "transparent",
                                border: "1px solid #90946B",
                                boxSizing: "border-box",
                                boxShadow: "none",
                                color: "var(--Text, #90946B)",
                                fontFamily: "Arial",
                                fontStyle: "normal",
                                fontWeight: "400",
                                lineHeight: "100%",
                                textIndent: "7%",
                                borderRadius: '0',
                                marginLeft: '15%',
                                marginTop: '0'
                            }}
                        />
                    </div>
                    <div className='BookSessionInfoCredentials BookSessionInfoEmail'>
                        <label htmlFor='Day'>Day</label>
                        <select onChange={changed(setDay)} value={day} id='Day' name='day'>
                            {daysOptions}
                        </select>
                    </div>
                    <div style={{ gridColumn: '3 / span 2' }} className='BookSessionInfoCredentials BookSessionInfoEmail'>
                        <label htmlFor='Reach'>How Do We Reach You?</label>
                        <select onChange={changed(setPrefWay)} value={prefWay} id='Reach' name='reach'>
                            <option value='WhatsApp'>WhatsApp</option>
                            <option value='Email'>Email</option>
                            <option value='Call'>Call</option>
                        </select>
                    </div>
                </form>
                <div className='BookSessionButton'>
                    <button onClick={sendRequest} >SEND ON WHATSAPP</button>
                </div>
            </div>
        </div>
        </>
    )
}
