import React from 'react'
import LinkedText from './LinkedText'
import { SAFETY_NOTE } from '../seo/meta.mjs'

// What to do in a crisis, at the end of the service, New Cairo, contact and booking pages.
export default function SafetyNote()
{
    return (
        <section className='ServiceDetails SafetyNote' aria-label={SAFETY_NOTE.heading}>
            <h2>{SAFETY_NOTE.heading}</h2>
            {SAFETY_NOTE.text.map(text => <p key={text}><LinkedText text={text} links={SAFETY_NOTE.links} /></p>)}
        </section>
    )
}
