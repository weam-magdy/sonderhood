import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HelpButton from './HelpButton'
import { FINDER_PATH, FINDER_TOPICS } from '../../seo/finder.mjs'

// The home page's "I am looking for a therapist to help me with my..." buttons.
// "Find a therapist" opens the finder with these topics already chosen, handed over
// as navigation state so they never appear in the address or browser history; it
// asks the rest and sends the answers to the practice on WhatsApp.
export default function LookingForHelp()
{
    const navigate = useNavigate()
    const [search, setSearch] = useState([])

    const toggle = (id) => setSearch(list => (list.includes(id) ? list.filter(topic => topic !== id) : [...list, id]))

    const buttonItems = FINDER_TOPICS.map(topic => <HelpButton handleClick={() => toggle(topic.id)} key={topic.id} button={topic.short} pressed={search.includes(topic.id)} />)

    return (
        <div className='LookingForHelpContainer'>
            <div className='LookingForHelpHeader'>
                <h1>I AM LOOKING FOR A THERAPIST TO HELP ME WITH MY:</h1>
            </div>
            <div className='LookingForHelpItemsContainer'>
                <div className='LookingForHelpItemsMostSearched'>
                </div>
                <div className='LookingForHelpItems'>
                    {buttonItems}
                </div>
                <div className='LookingForHelpItemsButtons'>
                    <button type='button' onClick={() => navigate(FINDER_PATH, { state: { help: search } })} className='LookingForHelpItemsFindButton'>FIND A THERAPIST</button>
                </div>
            </div>
        </div>
    )
}
