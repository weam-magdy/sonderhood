import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function WhySonderHoodSec() 
{
    const navigate = useNavigate()

    return (
        <div className='WhySonderContainer'>
            <div className='WhySonderHeader'>
                <h1>WHY CHOOSE <span>THE SONDERHOOD?</span></h1>
            </div>
            <div className='WhySonderItemsContainer'>
                <div className='WhySonderItem'>
                    <div className='WhySonderItemSVG'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="104" height="103" viewBox="0 0 104 103" fill="none">
                            <path d="M40.3556 0H28.2671V102.26H40.3556V0Z" fill="#FFF1CE"/>
                            <path d="M12.3635 0H0.274902V102.26H12.3635V0Z" fill="#FFF1CE"/>
                            <path d="M67.9753 1.07576L56.6406 5.27454L92.14 101.172L103.475 96.9733L67.9753 1.07576Z" fill="#FFF1CE"/>
                        </svg>
                    </div>
                    <div className='WhySonderItemInfo'>
                        <div className='WhySonderItemTitle'>
                            Short waiting time
                        </div>
                        <div className='WhySonderItemBody'>
                            You do not have to wait forever to find a slot. We guarantee to find you the nearest availability.
                        </div>
                    </div>
                </div>

                <div className='WhySonderItem'>
                    <div className='WhySonderItemSVG'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="118" height="117" viewBox="0 0 118 117" fill="none">
                            <path d="M58.625 117C90.9337 117 117.125 90.8087 117.125 58.5C117.125 26.1913 90.9337 0 58.625 0C26.3163 0 0.125 26.1913 0.125 58.5C0.125 90.8087 26.3163 117 58.625 117Z" fill="#E0902C"/>
                        </svg>
                    </div>
                    <div className='WhySonderItemInfo'>
                        <div className='WhySonderItemTitle'>
                            Confidentiality
                        </div>
                        <div className='WhySonderItemBody'>
                            All your data remains entirely confidential. Whatever you say in the therapy room to your therapist, stays there. 
                        </div>
                    </div>
                </div>

                <div className='WhySonderItem'>
                    <div className='WhySonderItemSVG'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="84" height="123" viewBox="0 0 84 123" fill="none">
                            <path d="M83.8738 123H0.875V41.4265C0.875 18.5834 19.4926 0 42.375 0C65.2574 0 83.875 18.5834 83.875 41.4265V123H83.8738Z" fill="#454733"/>
                        </svg>
                    </div>
                    <div className='WhySonderItemInfo'>
                        <div className='WhySonderItemTitle'>
                            Safety
                        </div>
                        <div className='WhySonderItemBody'>
                            We offer a safe, guarded space for you to vent, protected by 24/7 security service for therapists and clients.
                        </div>
                    </div>
                </div>

                <div className='WhySonderItem'>
                    <div className='WhySonderItemSVG'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="97" height="88" viewBox="0 0 97 88" fill="none">
                            <path d="M35.8244 49.6833V88H0.125V57.75C0.125 41.3722 2.09803 29.5167 6.04408 22.1833C11.2233 12.4056 19.4237 5.01111 30.6452 0L38.784 12.8333C32.0017 15.6444 27.0075 19.8611 23.8013 25.4833C20.5951 30.9833 18.8071 39.05 18.4371 49.6833H35.8244ZM93.1655 49.6833V88H57.466V57.75C57.466 41.3722 59.4391 29.5167 63.3851 22.1833C68.5643 12.4056 76.7647 5.01111 87.9863 0L96.125 12.8333C89.3427 15.6444 84.3485 19.8611 81.1423 25.4833C77.9362 30.9833 76.1481 39.05 75.7782 49.6833H93.1655Z" fill="#FFF1CE"/>
                        </svg>
                    </div>
                    <div className='WhySonderItemInfo'>
                        <div className='WhySonderItemTitle'>
                            Professional
                        </div>
                        <div className='WhySonderItemBody'>
                            Our process includes a detailed Consent Form and assessments to set the boundaries as well as track your progress in therapy. 
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='WhySonderItemsButtons'>
                    <button onClick={() => navigate('/RequestASession')} className='WhySonderItemBookButton'>REQUEST A BOOKING</button>
                    {/* <button onClick={() => navigate('/ContactUs')} className='WhySonderItemContactButton'>CONTACT US</button> */}
            </div>
        </div>
    )
}
