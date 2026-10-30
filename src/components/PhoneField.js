import React, { Suspense, lazy } from 'react'

// The phone box and its country list load on their own, so the pages without a form
// do not carry them. A plain box holds the place for the moment that takes.
const PhoneInput = lazy(() => import('react-phone-input-2'))

export default function PhoneField(props)
{
    const placeholder = (
        <div className='react-tel-input'>
            <input {...props.inputProps} type='tel' className='form-control' style={props.inputStyle} readOnly />
        </div>
    )
    return (
        <Suspense fallback={placeholder}>
            <PhoneInput {...props} />
        </Suspense>
    )
}
