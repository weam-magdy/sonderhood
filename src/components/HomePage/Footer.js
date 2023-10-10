import React, { useState } from 'react'
import { twitter } from '../../imgs/twitterIcon'
import { instagram } from '../../imgs/InstagramIcon'
import { In } from '../../imgs/inIcon'
import { Link } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../Config/firebaseConfig'

export default function Footer()
{   
    const [email , setEmail] = useState('')
    const newsLetterCollection = collection(db, 'newsletter')

    async function handleSubmit(e)
    {
        e.preventDefault()
        await addDoc(newsLetterCollection, { email })
        setEmail('')
    }
    
    return (
        <footer className='HomeFooter'>
                <div className='HomeFooterInfo'>
                    <div className='HomeFooterInfoLogo'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="141" height="84" viewBox="0 0 141 84" fill="none">
                            <g clipPath="url(#clip0_75_927)">
                                <path d="M67.2601 30.9291V43.2114C67.2601 44.3737 67.9019 45.446 68.9066 45.9926H63.3286C64.3574 45.446 64.9976 44.3753 64.9976 43.2114V30.9291H64.746C62.5061 30.9291 60.5404 32.4789 60.0146 34.6443L60.4952 32.0223L60.7919 30.405C60.7919 30.405 61.2951 30.7024 63.9929 30.7024H68.2438C70.9643 30.7024 71.4674 30.405 71.4674 30.405L71.7657 32.0223L72.2463 34.6443C71.698 32.4789 69.7548 30.9291 67.4907 30.9291H67.2617H67.2601Z" fill="#FFF1CE"/>
                                <path d="M85.3634 43.2115C85.3634 44.3738 86.0052 45.4461 87.0324 45.9927H81.4544C82.4607 45.4461 83.1009 44.3754 83.1009 43.2115V38.0847H76.4715V43.2115C76.4715 44.3738 77.1117 45.4461 78.1163 45.9927H72.5625C73.5688 45.4461 74.2074 44.3754 74.2074 43.2115V33.503C74.2074 32.3407 73.5672 31.27 72.5625 30.7009H78.1163C77.1101 31.27 76.4715 32.3407 76.4715 33.503V37.8549H83.1009V33.503C83.1009 32.3407 82.4591 31.27 81.4544 30.7009H87.0324C86.0036 31.27 85.3634 32.3407 85.3634 33.503V43.2115Z" fill="#FFF1CE"/>
                                <path d="M91.2849 30.9291V37.8564H92.4976C93.7764 37.8564 95.3084 37.4239 95.6293 35.6009V40.3176C95.2858 38.403 93.778 38.0846 92.4976 38.0846H91.2849V45.7643H93.5264C95.7889 45.7643 97.7547 44.2354 98.2804 42.0716L97.5499 45.9909H87.355C88.3838 45.4443 89.0224 44.3737 89.0224 43.2098V33.5013C89.0224 32.339 88.3822 31.2683 87.355 30.6992H97.5499L98.2804 34.6411C97.7547 32.4756 95.7889 30.9259 93.5264 30.9259H91.2849V30.9291Z" fill="#FFF1CE"/>
                                <path d="M61.5692 64.665C61.1354 64.665 60.9274 64.9399 60.9274 64.9399L60.105 60.3132C60.105 60.3132 61.4547 64.3017 65.0202 64.6891C65.2701 64.7132 65.5007 64.7357 65.7281 64.7357C67.8551 64.7357 68.6776 63.4368 68.6776 61.8645C68.5857 60.2006 67.9922 59.3582 66.4377 58.6059L62.003 56.4645C60.6532 55.8022 60.0146 54.5498 60.0146 53.2959C60.0146 51.8828 60.8371 50.4697 62.4384 49.9456C63.1915 49.6964 64.0381 49.5356 64.9976 49.5356C65.7733 49.5582 65.912 49.5356 67.3294 49.7639C67.7165 49.8314 68.0148 49.8556 68.2422 49.8556C68.9066 49.8556 69.0662 49.6739 69.0662 49.6739L69.8209 53.8425C69.8209 53.8425 68.5405 49.7639 64.9976 49.7639C63.306 49.7639 62.3449 51.0854 62.3449 52.4519C62.3449 53.3859 62.8254 54.3199 63.8527 54.8215L68.3341 57.0095C69.8661 57.7377 70.6417 59.2184 70.6417 60.6781C70.6417 63.1844 68.4712 65.054 64.996 65.054C63.1221 65.054 62.1385 64.6666 61.5676 64.6666L61.5692 64.665Z" fill="#FFF1CE"/>
                                <path d="M86.9404 57.3037C86.9404 61.5881 84.0829 65.0525 79.237 65.0525C74.3911 65.0525 71.5352 61.5897 71.5352 57.3037C71.5352 53.0178 74.5072 49.5325 79.237 49.5325C83.9667 49.5325 86.9404 53.0194 86.9404 57.3037ZM84.4941 57.3037C84.4941 53.1352 82.4606 49.7624 79.237 49.7624C76.0134 49.7624 73.9815 53.1352 73.9815 57.3037C73.9815 61.4723 76.0392 64.8242 79.237 64.8242C82.688 64.8242 84.4941 61.4739 84.4941 57.3037Z" fill="#FFF1CE"/>
                                <path d="M89.1351 51.6547V62.1589C89.1351 63.3212 89.7769 64.3935 90.7816 64.9401H87.2612C88.2901 64.3935 88.9061 63.3228 88.9061 62.1589V52.4504C88.9061 51.2431 88.2659 50.2174 87.2612 49.6483H90.4606L99.2381 60.9499V52.4488C99.2381 51.2865 98.5979 50.2158 97.5932 49.6467H101.114C100.107 50.2158 99.4687 51.2865 99.4687 52.4488V64.9594L89.1351 51.6514V51.6547Z" fill="#FFF1CE"/>
                                <path d="M108.063 49.6483C112.978 49.6483 115.674 53.0436 115.674 57.3038C115.674 61.5641 113.045 64.961 107.971 64.961L101.433 64.9385C102.439 64.3919 103.078 63.3212 103.078 62.1573V52.4488C103.078 51.2865 102.438 50.2158 101.433 49.6467H108.063V49.6483ZM108.017 64.7343C111.675 64.7343 113.25 61.4531 113.25 57.3038C113.25 53.1546 111.352 49.875 107.995 49.875H105.342V64.7102H108.017V64.7327V64.7343Z" fill="#FFF1CE"/>
                                <path d="M119.925 49.8766V56.8039H121.136C122.416 56.8039 123.948 56.3714 124.267 54.5484V59.2651C123.924 57.3505 122.416 57.0322 121.136 57.0322H119.925V64.7118H122.164C124.429 64.7118 126.394 63.1829 126.92 61.0191L126.188 64.9385H115.995C117.023 64.3919 117.662 63.3212 117.662 62.1573V52.4488C117.662 51.2865 117.022 50.2158 115.995 49.6467H126.188L126.92 53.5886C126.394 51.4232 124.429 49.8734 122.164 49.8734H119.925V49.8766Z" fill="#FFF1CE"/>
                                <path d="M139.49 63.4128C140.474 63.4128 140.998 62.1814 140.998 62.1814C140.861 63.5945 139.785 64.9851 138.345 64.9851C136.905 64.9851 135.694 64.371 134.825 61.4306C133.978 58.6044 132.356 57.9678 131.374 57.8521H131.169V62.2039C131.169 63.3662 131.785 64.4144 132.814 64.9851H127.238C128.244 64.416 128.883 63.3678 128.883 62.2039V52.4729C128.883 51.3106 128.242 50.2641 127.238 49.6934H134.483C137.547 49.6934 139.307 51.5148 139.307 53.7719C139.307 56.029 137.433 57.8505 134.346 57.8505H132.884C137.091 58.6945 137.021 61.7698 138.278 62.8646C138.736 63.2746 139.147 63.4112 139.49 63.4112V63.4128ZM131.169 57.5788H133.019C135.465 57.5788 136.883 55.8683 136.883 53.7269C136.883 51.5855 135.42 49.875 133.019 49.875H131.169V57.5772V57.5788Z" fill="#FFF1CE"/>
                                <path d="M72.8155 81.1062C72.8155 82.2686 73.4557 83.3408 74.483 83.8874H68.9066C69.9128 83.3408 70.5514 82.2702 70.5514 81.1062V75.9795H63.9236V81.1062C63.9236 82.2686 64.5638 83.3408 65.5685 83.8874H60.0146C61.0209 83.3408 61.6595 82.2702 61.6595 81.1062V71.3978C61.6595 70.2355 61.0193 69.1648 60.0146 68.5957H65.5685C64.5622 69.1648 63.9236 70.2355 63.9236 71.3978V75.7496H70.5514V71.3978C70.5514 70.2355 69.9112 69.1648 68.9066 68.5957H74.483C73.4541 69.1648 72.8155 70.2355 72.8155 71.3978V81.1062Z" fill="#FFF1CE"/>
                                <path d="M90.2109 76.2512C90.2109 80.5356 87.3534 84 82.5075 84C77.6616 84 74.8057 80.5372 74.8057 76.2512C74.8057 71.9653 77.7777 68.48 82.5075 68.48C87.2373 68.48 90.2109 71.9669 90.2109 76.2512ZM87.7646 76.2512C87.7646 72.0827 85.7311 68.7099 82.5075 68.7099C79.2839 68.7099 77.252 72.0827 77.252 76.2512C77.252 80.4198 79.3097 83.7717 82.5075 83.7717C85.9585 83.7717 87.7646 80.4214 87.7646 76.2512Z" fill="#FFF1CE"/>
                                <path d="M107.079 76.2512C107.079 80.5356 104.221 84 99.3752 84C94.5293 84 91.6733 80.5372 91.6733 76.2512C91.6733 71.9653 94.6454 68.48 99.3752 68.48C104.105 68.48 107.079 71.9669 107.079 76.2512ZM104.632 76.2512C104.632 72.0827 102.599 68.7099 99.3752 68.7099C96.1516 68.7099 94.1197 72.0827 94.1197 76.2512C94.1197 80.4198 96.1774 83.7717 99.3752 83.7717C102.826 83.7717 104.632 80.4214 104.632 76.2512Z" fill="#FFF1CE"/>
                                <path d="M114.027 68.5958C118.943 68.5958 121.639 71.9912 121.639 76.2514C121.639 80.5116 119.01 83.9085 113.935 83.9085L107.398 83.886C108.404 83.3394 109.043 82.2687 109.043 81.1048V71.3963C109.043 70.234 108.403 69.1633 107.398 68.5942H114.027V68.5958ZM113.982 83.6818C117.64 83.6818 119.215 80.4006 119.215 76.2514C119.215 72.1021 117.317 68.8225 113.96 68.8225H111.307V83.6577H113.982V83.6802V83.6818Z" fill="#FFF1CE"/>
                                <path d="M24.3602 30.8647H22.6089V83.127H24.3602V30.8647Z" fill="#FFF1CE"/>
                                <path d="M55.8816 29.9919H0.0708008V31.7378H55.8816V29.9919Z" fill="#FFF1CE"/>
                                <path d="M11.5384 30.8647H9.78711V83.127H11.5384V30.8647Z" fill="#FFF1CE"/>
                                <path d="M36.436 30.1519L34.7993 30.7776L55.0579 83.4449L56.6946 82.8192L36.436 30.1519Z" fill="#FFF1CE"/>
                                <path d="M56.7574 84H0V28.291C0 12.6906 12.7315 0 28.3787 0C44.0258 0 56.7574 12.6906 56.7574 28.291V84ZM1.75129 82.2541H55.0044V28.291C55.0044 13.6552 43.0599 1.74588 28.3771 1.74588C13.6943 1.74588 1.75129 13.6552 1.75129 28.291V82.2525V82.2541Z" fill="#FFF1CE"/>
                                <path d="M28.3785 26.767C22.4957 26.767 17.7095 21.9955 17.7095 16.1309C17.7095 10.2663 22.4957 5.49487 28.3785 5.49487C34.2613 5.49487 39.0475 10.2663 39.0475 16.1309C39.0475 21.9955 34.2613 26.767 28.3785 26.767ZM28.3785 7.24075C23.4616 7.24075 19.4608 11.2293 19.4608 16.1309C19.4608 21.0326 23.4616 25.0211 28.3785 25.0211C33.2953 25.0211 37.2962 21.0326 37.2962 16.1309C37.2962 11.2293 33.2953 7.24075 28.3785 7.24075Z" fill="#FFF1CE"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_75_927">
                                <rect width="141" height="84" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className='HomeFooterInfoCopyRights'>
                        Copyright © 2023 The Sonderhood<br />
                        | All Rights Reserved 
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='HomeFooterSubscribe'>
                    <label htmlFor='newsletter'>Subscribe to our newsletter</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} id='newsletter' type='email' placeholder='Email...' />
                    <button className='HomeFooterSubscribeButton'>Send</button>
                </form>
                <div className='HomeFooterSocials'>
                    <div className='HomeFooterSocialsFollowUs'>
                        Follow us
                    </div>
                    <div className='HomeFooterSocialsIcons'>
                        <Link to='https://www.facebook.com/profile.php?id=100092881591617'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <rect width="36" height="36" rx="8" fill="#F9F3D0"/>
                                <path d="M19.4638 27V18.7894H22.3585L22.7919 15.5895H19.4637V13.5465C19.4637 12.6201 19.7339 11.9888 21.1293 11.9888L22.909 11.988V9.12607C22.6012 9.08715 21.5447 9 20.3157 9C17.7497 9 15.9929 10.4912 15.9929 13.2297V15.5895H13.0908V18.7894H15.9929V26.9999H19.4638V27Z" fill="#90946B"/>
                            </svg>
                        </Link>
                        <Link to=''>
                            {twitter}
                        </Link>
                        <Link to='https://www.instagram.com/thesonderhood/'>
                            {instagram}
                        </Link>
                        <Link to='https://www.linkedin.com/company/94863370/admin/feed/posts/'>
                            {In}
                        </Link>
                    </div>
                </div>
            </footer>
    )
}
