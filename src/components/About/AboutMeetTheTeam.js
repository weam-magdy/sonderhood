import React, { useState } from 'react'
import Therapist from '../HomePage/Therapists'
import { useNavigate } from 'react-router-dom'
import { selectAllServices } from '../../seo/selectors'
import { useSelector } from 'react-redux'
import { selectedTherapists, selectTherapistsStatus } from '../../app/therapists/therapistsSlice'

export default function AboutMeetTheTeam() {
    const [selectedService, setSelectedService] = useState('All Services')
    const [filteredTherapists, setFilteredTherapists] = useState(null)

    const services = useSelector(selectAllServices)
    const therapistsData = useSelector(selectedTherapists)
    const therapistsStatus = useSelector(selectTherapistsStatus)

    const navigate = useNavigate()

    function handleFilter(e) {
        const serviceTitle = e.target.value
        setSelectedService(serviceTitle)

        const service = services?.find(serviceItem => serviceItem.title === serviceTitle)

        if (service) {
            let therapistsArray = []
            service.therapists.forEach(therapist => {
                const foundTherapist = therapistsData.find(data => data.id === therapist.id)
                if (foundTherapist) {
                    therapistsArray.push(foundTherapist)
                }
            })
            setFilteredTherapists(therapistsArray)
        } else {
            setFilteredTherapists(null) // null means show all
        }
    }

    const servicesOptions = services?.map(service => (
        <option
            value={service.title}
            key={service.title}
        >
            {service.title}
        </option>
    )) || []

    // Use filtered list if filtering, otherwise use all therapists from Redux
    const displayList = filteredTherapists !== null ? filteredTherapists : therapistsData

    // Show loading state while fetching
    if (therapistsStatus === 'loading' || therapistsStatus === 'idle') {
        return (
            <div className='MeetTheTeamContainer'>
                <div className='MeetTheTeamHeader'>
                    <div className='MeetTheTeamHeaderContainer'>
                        <div className='MeetTheTeamHeaderTitle'>
                            <h1>MEET THE <span>TEAM</span></h1>
                        </div>
                    </div>
                </div>
                <div className='MeetTheTeamItemsContainer'>
                    <div className='NoTherapists'>Loading therapists...</div>
                </div>
            </div>
        )
    }

    const therapistsDisplay = !displayList || displayList.length === 0
        ? (
            <div className='NoTherapists'>
                No Therapists Available
            </div>
        )
        : displayList.map((therapist, index) =>
            therapist ? <Therapist key={therapist.id || index} therapist={therapist} /> : null
        )

    return (
        <div className='MeetTheTeamContainer'>
            <div className='MeetTheTeamHeader'>
                <div className='MeetTheTeamHeaderContainer'>
                    <div className='MeetTheTeamHeaderTitle'>
                        <h1>MEET THE <span>TEAM</span></h1>
                    </div>
                    <div className='MeetTheTeamHeaderDesc'>
                        Get to know our exceptional team of experienced and compassionate therapists. Each member is dedicated to supporting your well-being and helping you thrive on your journey toward personal growth and mental health.
                    </div>
                </div>
                <div className='MeetTheTeamHeaderFilters'>
                    <div className='MeetTheTeamHeaderFiltersInput'>
                        <label htmlFor='filters'>FILTER BY:</label>
                        <select onChange={handleFilter} id='filters' value={selectedService}>
                            <option value='All Services'>All Services</option>
                            {servicesOptions}
                        </select>
                    </div>
                </div>
            </div>
            <div className='MeetTheTeamItemsContainer'>
                {therapistsDisplay}
            </div>
            <div className='MeetTheTeamItemsButtons'>
                <button onClick={() => navigate('/book')} className='MeetTheTeamItemBookButton'>REQUEST A BOOKING</button>
            </div>
        </div>
    )
}
