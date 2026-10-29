import { createSelector } from '@reduxjs/toolkit'
import { selectedServices } from '../app/services/servicesSlice'
import { selectedTherapists } from '../app/therapists/therapistsSlice'
import { mergeServices } from './meta.mjs'

// Firestore services plus the static ones in meta.mjs, with slugs and display names.
export const selectAllServices = createSelector([selectedServices, selectedTherapists], mergeServices)
