import React, { useState } from 'react'
import PagesHeader from '../PagesHeader/PagesHeader'
import AboutMeetTheTeam from './AboutMeetTheTeam'
import AboutTherapistsPledge from './AboutTherapistsPledge'
import useSeo from '../../seo/useSeo'
import { PAGES, aboutFacts, pageLd } from '../../seo/meta.mjs'
import { useSelector } from 'react-redux'
import { selectedTherapists } from '../../app/therapists/therapistsSlice'
import LinkedText from '../LinkedText'
import ReactPlayer from 'react-player'
//@ts-ignore
import video from '../../video/vid.mp4'

export default function About() {
    useSeo({ ...PAGES.about, jsonLd: pageLd({ name: 'About Us', path: PAGES.about.path }) })

    const [playing, setPlaying] = useState(true)
    const therapists = useSelector(selectedTherapists)

    return (
        <>
            <div className='AboutPageContainer'>
                <PagesHeader />
                <div className='AboutPage'>
                    <div className='AboutPageOurStory'>
                        <h1 className='AboutPageOurStoryTitle'>
                            OUR STORY
                        </h1>
                        <div className='AboutPageOurStoryDesc'>
                            <div className='AboutPageDescFirstPart'>
                                "The most valuable aspect of my undergraduate years was the university campus's 24/7 accessibility. It was the sole location where I felt truly accommodated at any hour. This place bore witness to my moments of reflection, intensive study, pivotal decision-making, genuine laughter with cherished companions, and much more. In contrast, all other environments seemed to exert pressure, preventing these activities from occurring with peace of mind. As a graduate student, I continued to frequent this place,
                            </div>
                            <div className='AboutPageDescSecPart'>
                                but it wasn't until the COVID-19 pandemic forced campus closure that I recognized its profound significance. It was then that I realized everyone should have access to such a place.
                                <br />A sanctuary accessible around the clock.
                                <br />A haven devoid of external pressures.
                                <br />A space where, for once, the focus is solely on oneself.
                                <br />A place to feel, for once, that “it’s about me now, not others” A place to feel home….​"
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }} className='AboutPageVideo' onClick={() => setPlaying(prev => !prev)}>
                        {/*//@ts-ignore*/}
                        {/* <iframe src="https://www.youtube.com/embed/-MKapbz0GIo?si=kxc7xo9Z2RFjCMsV&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
                        {/* <div className='IFrameClone'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="98" height="97" viewBox="0 0 98 97" fill="none">
                            <circle cx="49.0001" cy="48.5001" r="48.1732" fill="#FFFDF4"/>
                            <path d="M61.2434 46.7679C62.5767 47.5377 62.5767 49.4622 61.2434 50.232L44.3784 59.969C43.0451 60.7388 41.3784 59.7765 41.3784 58.2369L41.3784 38.7629C41.3784 37.2233 43.0451 36.2611 44.3784 37.0309L61.2434 46.7679Z" fill="#464834"/>
                        </svg>
                    </div> */}
                        <ReactPlayer
                            playing={playing}
                            style={{ zIndex: '1' }}
                            // stopOnUnmount={true}
                            // url={'https://www.youtube.com/watch?v=5-vMcPR7Bws&list=PLZOsvm-FGi10AhLNm8ZmVqhj_7OrNSAnE'} 
                            url={video}
                        />
                        {
                            !playing &&
                            <div style={{ position: 'absolute', zIndex: '2', alignSelf: 'center', display: 'flex', justifySelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="98" height="97" viewBox="0 0 98 97" fill="none">
                                    <circle cx="49.0001" cy="48.5001" r="48.1732" fill="#FFFDF4" />
                                    <path d="M61.2434 46.7679C62.5767 47.5377 62.5767 49.4622 61.2434 50.232L44.3784 59.969C43.0451 60.7388 41.3784 59.7765 41.3784 58.2369L41.3784 38.7629C41.3784 37.2233 43.0451 36.2611 44.3784 37.0309L61.2434 46.7679Z" fill="#464834" />
                                </svg>
                            </div>
                        }
                        {/* <video>
                        <source src={video}/>
                    </video> */}
                    </div>
                </div>
            </div>
            <section className='ServiceDetails AboutFacts' aria-label='The Sonder Hood at a glance'>
                <h2>The Sonder Hood at a glance</h2>
                <dl>
                    {aboutFacts(therapists.length).map(([label, text]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd><LinkedText text={text} /></dd>
                        </div>
                    ))}
                </dl>
            </section>
            <AboutMeetTheTeam />
            <AboutTherapistsPledge />
        </>
    )
}
