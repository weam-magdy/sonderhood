import React, { useEffect, useRef } from 'react'

// A form's error or success message. It scrolls itself into view when it appears,
// because it sits above the form while the send button is far below it. The jump is
// instant: Chrome's scroll anchoring cancels a smooth scroll started as it appears.
// The effect body must not return scrollIntoView's result: current Chrome returns a
// Promise, React then calls it as the cleanup on unmount, and the whole app crashes.
export default function FormNotice({ children })
{
    const ref = useRef(null)

    useEffect(() =>
    {
        ref.current?.scrollIntoView({ block: 'center' })
    }, [])

    return <div ref={ref} className='BookError' role='status'>{children}</div>
}
