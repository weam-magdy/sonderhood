import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PagesHeader from '../PagesHeader/PagesHeader'
import SafeImage from '../SafeImage'
import useSeo from '../../seo/useSeo'
import { INTROS, PAGES, pageLd, therapistSlug } from '../../seo/meta.mjs'
import { FINDER_FOR, FINDER_LANGUAGES, FINDER_MODES, FINDER_TOPICS, finderMessage, inSentence, knownTopics, matchTherapists, soleTherapistFor } from '../../seo/finder.mjs'
import { selectedTherapists, selectTherapistsStatus } from '../../app/therapists/therapistsSlice'
import { openWhatsApp } from '../../utils/contact'

// Answers stay in memory for the visit, so they survive opening a suggested profile
// and coming back. They are never stored on the device or sent anywhere.
const remembered = { key: null, topics: [], who: '', mode: '', language: '', name: '' }

// One question with single-choice answers, as a labelled group of radio buttons.
function Choice({ legend, name, options, value, onChange })
{
    return (
        <fieldset className='FinderQuestion'>
            <legend>{legend} <span className='FinderLegendHint'>(choose one)</span></legend>
            <div className='FinderOptions'>
                {options.map(option => (
                    <label key={option.id} className='FinderOption'>
                        <input type='radio' name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    )
}

function listNames(names)
{
    return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names.join('')
}

// /find-a-therapist: a few questions, the therapists whose profiles fit, and the
// answers sent to the practice as the first WhatsApp message.
export default function FindTherapist()
{
    useSeo({ ...PAGES.finder, jsonLd: pageLd({ name: 'Find Your Therapist', path: PAGES.finder.path }) })

    const therapists = useSelector(selectedTherapists)
    const status = useSelector(selectTherapistsStatus)

    // Topics picked on the home page arrive as navigation state, once per visit to this entry.
    const location = useLocation()
    if (location.state && Array.isArray(location.state.help) && location.key !== remembered.key)
    {
        remembered.key = location.key
        remembered.topics = knownTopics(location.state.help)
    }

    const [topics, setTopics] = useState(remembered.topics)
    const [who, setWho] = useState(remembered.who)
    const [mode, setMode] = useState(remembered.mode)
    const [language, setLanguage] = useState(remembered.language)
    const [name, setName] = useState(remembered.name)

    useEffect(() =>
    {
        Object.assign(remembered, { topics, who, mode, language, name })
    }, [topics, who, mode, language, name])

    const toggleTopic = (id) => setTopics(list => (list.includes(id) ? list.filter(topic => topic !== id) : [...list, id]))

    const matches = useMemo(() => (who ? matchTherapists(therapists, { topics, who, language }) : []), [therapists, topics, who, language])
    const names = matches.map(match => match.therapist.name)
    const sole = soleTherapistFor(language)

    const send = (therapist) => openWhatsApp(finderMessage({ name, topics, who, mode, language, suggested: names, therapist }), 'therapist_finder')

    const summary = !who ? '' : names.length ? `${names.length === 1 ? 'One therapist' : `${names.length} therapists`} may suit you: ${listNames(names)}.` : 'No exact match. Send us your answers and we will suggest a therapist.'

    return (
        <div className='SimplePageContainer'>
            <PagesHeader />
            <div className='Finder'>
                <h1 className='AboutPageOurStoryTitle'>FIND YOUR THERAPIST</h1>
                <p className='FinderIntro'>{INTROS.finder}</p>

                <fieldset className='FinderQuestion'>
                    <legend>1. What would you like help with? <span className='FinderLegendHint'>(choose all that apply)</span></legend>
                    <p className='FinderHint'>Not sure? You can skip this question.</p>
                    <div className='FinderOptions'>
                        {FINDER_TOPICS.map(topic => (
                            <label key={topic.id} className='FinderOption'>
                                <input type='checkbox' name='help' value={topic.id} checked={topics.includes(topic.id)} onChange={() => toggleTopic(topic.id)} />
                                <span>{topic.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <Choice legend='2. Who is the therapy for?' name='who' options={FINDER_FOR} value={who} onChange={setWho} />
                <Choice legend='3. How would you like to meet?' name='mode' options={FINDER_MODES} value={mode} onChange={setMode} />
                <Choice legend='4. Which language would you prefer?' name='language' options={FINDER_LANGUAGES} value={language} onChange={setLanguage} />

                <div className='FinderQuestion FinderName'>
                    <label htmlFor='FinderName'>Your first name (optional)</label>
                    <input id='FinderName' type='text' name='firstname' autoComplete='given-name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <section className='FinderResults' aria-label='Your matches'>
                    <p className='VisuallyHidden' role='status'>{summary}</p>
                    {!who && <p className='FinderHint'>Answer question 2 to see the therapists who may suit you.</p>}
                    {who && (
                        <>
                            <h2 className='FinderResultsTitle'>{matches.length ? 'Therapists who may suit you' : 'We will match you ourselves'}</h2>
                            {!matches.length && status !== 'failed' && <p>No profile on the site lists everything you chose. Send us your answers and our team will suggest the right therapist.</p>}
                            {status === 'failed' && <p>Our team list did not load just now. Send us your answers and we will suggest a therapist.</p>}
                            {who === 'child' && <p className='FinderNote'>Sessions for children are held at our center in New Cairo.</p>}
                            {sole && <p className='FinderNote'>Sessions in {FINDER_LANGUAGES.find(option => option.id === language).label} are with {sole}.</p>}
                            {matches.length > 0 && (
                                <div className='FinderMatches'>
                                    {matches.map(({ therapist, hits }) => (
                                        <article key={therapist.id} className='FinderMatch'>
                                            <div className='FinderMatchImage'>
                                                <SafeImage src={therapist.image} alt={`${therapist.name}, ${String(therapist.position || 'therapist').trim()} at The Sonder Hood`} label={therapist.name} />
                                            </div>
                                            <div className='FinderMatchInfo'>
                                                <h3><Link to={`/therapists/${therapistSlug(therapist)}`}>{therapist.name}</Link></h3>
                                                <p className='FinderMatchRole'>{String(therapist.position || '').trim()}</p>
                                                {hits.length > 0 && <p className='FinderMatchFit'>Works with: {hits.map(hit => inSentence(hit.label)).join(', ')}</p>}
                                                <button type='button' className='FinderBookWith' onClick={() => send(therapist.name)}>Book with {String(therapist.name).split(' ')[0]}</button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                            <button type='button' className='FinderSend' onClick={() => send()}>Send my answers on WhatsApp</button>
                            <p className='FinderPrivacy'>Your answers are not saved on this website. They reach us only when you press send in WhatsApp.</p>
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}
