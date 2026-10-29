import React from 'react'
import FAQItem from './FAQItem'
import { HOME_FAQS } from '../../seo/meta.mjs'

// The home page questions live in src/seo/meta.mjs, so they are part of the
// prerendered HTML and the FAQPage data. Service pages pass their own.
export default function FAQ({ faqs })
{
    const faqsData = faqs?.length ? faqs : HOME_FAQS

    const faqItems = faqsData.map((question, index) => <FAQItem key={index} faq={question} faqs={faqsData} index={index} />)

    return (
        <div className='FAQContainer'>
            <div className='FAQHeader'>
                <h1>FREQUENTLY ASKED QUESTIONS</h1>
            </div>
            <div className='FAQItems'>
                {faqItems}
            </div>
        </div>
    )
}
