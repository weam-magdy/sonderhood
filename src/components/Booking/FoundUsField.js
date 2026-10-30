import React from 'react'
import { FOUND_US } from '../../seo/meta.mjs'

// The optional "How did you find us?" question. Its answer goes only into the WhatsApp message.
export default function FoundUsField({ value, onChange, className = 'BookSessionFoundUs', label = 'How Did You Find Us? (Optional)' })
{
    return (
        <div className={className}>
            <label htmlFor='FoundUs'>{label}</label>
            <select id='FoundUs' name='foundus' value={value} onChange={onChange}>
                <option value=''>Choose one...</option>
                {FOUND_US.map(option => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
        </div>
    )
}
