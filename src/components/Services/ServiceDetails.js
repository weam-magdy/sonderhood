import React from 'react'
import LinkedText from '../LinkedText'
import { longDate } from '../../seo/meta.mjs'

// A service page's longer write-up (src/seo/pageCopy.mjs): headed sections between
// the introduction and the therapists who offer the service. The New Cairo page uses
// the same layout.
export default function ServiceDetails({ sections, updated, label = 'About this service' })
{
    if (!sections?.length) return null
    return (
        <section className='ServiceDetails' aria-label={label}>
            {sections.map(section => (
                <div key={section.heading} className='ServiceDetailsSection'>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map(text => <p key={text}><LinkedText text={text} links={section.links} word /></p>)}
                </div>
            ))}
            {updated && <p className='ServiceDetailsUpdated'>Last updated {longDate(updated)}</p>}
        </section>
    )
}
