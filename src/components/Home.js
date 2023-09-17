import React from 'react'
import HomeHeader from './HomeHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Home() 
{
    return (
        <div className='HomePageContainer'>
            <HomeHeader />
            <div className='HomePage'>
                <div className='IVectors'>
                    <div className='IVector'></div>
                    <div className='IVector'></div>
                    <div className='IVectorTilted'></div>
                </div>
                <div className='HomePageBookSession'>
                    <div className='HomePageBookSessionText'>
                        <h6>Your</h6> <h6>Safe</h6> <h6>Haven</h6>
                    </div>
                    <div className='HomePageBookSessionButton'>
                        <button>Book a Session <FontAwesomeIcon icon={faArrowRight} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}
