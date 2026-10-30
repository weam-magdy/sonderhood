import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LinkedText from '../LinkedText'

export default function FAQItem({ faq, faqs, index }) 
{
    const [shown, setShown] = useState(false)

    const openIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
            <path d="M19.1582 4.1792V32.6792" stroke="#90946B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.9082 18.4292H33.4082" stroke="#90946B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const closeIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
            <path d="M4.7627 33.25L33.2627 4.75" stroke="#90946B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M33.2627 33.25L4.7627 4.75" stroke="#90946B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const toggle = () => setShown(prev => !prev)

    return (
        <>
        <div
            style={ faqs.length === (index+1) ? {} : shown ? {} : {borderBottom: '1px solid #000'} }
            onClick={toggle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
            role='button'
            tabIndex={0}
            aria-expanded={shown}
            className='FAQItem'
        >
            <div className='FAQItemHeading'>
                <div className='FAQItemHeadingNumber'>
                    { Math.floor((index+1) / 10) === 0 ? `0${index+1}` : index+1 }
                </div>
                <div className='FAQItemHeadingQuestion'>
                    {faq.question}
                </div>
                <div className='FAQItemHeadingController'>
                    { shown ? closeIcon : openIcon }
                </div>
            </div>
        </div>
        {/* Always in the page (search engines read it); CSS collapses it until opened. */}
        <div className={shown ? 'FAQItemAnswerWrapper open' : 'FAQItemAnswerWrapper'}>
            <div style={ faqs.length === (index+1) || !shown ? {} : {borderBottom: '1px solid #000'} } className={'FAQItemAnswerTemp'}>
                <LinkedText text={faq.answer} links={faq.links} word />
                {faq.cta && <Link className='FAQItemCta' to={faq.cta.path}>{faq.cta.label}</Link>}
            </div>
        </div>
        </>
    )
}
