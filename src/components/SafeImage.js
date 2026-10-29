import React, { useEffect, useState } from 'react'

function initials(text)
{
    return String(text || '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0].toUpperCase()).join('')
}

// An <img> that shows a branded tile with initials when the photo cannot load
// (Firebase Storage answers 402 while the project is on the Spark plan).
export default function SafeImage({ src, alt, label, loading = 'lazy', ...rest })
{
    const [failed, setFailed] = useState(!src)

    useEffect(() => setFailed(!src), [src])

    if (failed)
    {
        return (
            <div className='ImageFallback' role='img' aria-label={alt}>
                <span>{initials(label || alt)}</span>
            </div>
        )
    }

    return <img src={src} alt={alt} loading={loading} decoding='async' onError={() => setFailed(true)} {...rest} />
}
