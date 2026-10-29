import React from 'react'

// A topic button in "I am looking for a therapist to help me with my...". The parent
// owns the selection, so the look and the announced state always agree.
export default function HelpButton({ button, pressed, handleClick })
{
    return (
        <button
            type='button'
            aria-pressed={pressed}
            style={pressed ? { background: '#D6DCA2', border: '0', fontWeight: '600', width: '105%' } : {}}
            onClick={handleClick}
        >
            {button}
        </button>
    )
}
