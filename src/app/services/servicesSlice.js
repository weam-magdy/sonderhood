import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadCollection } from "../content";

// Async thunk to fetch services (from the content baked into the build), in their set order
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async () => {
        const services = await loadCollection('services')
        return services.filter(service => typeof service.order === 'number').sort((a, b) => a.order - b.order)
    },
    { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().services.status) }
)

export const servicesSlice = createSlice({
    name: 'services',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default servicesSlice.reducer

export const selectedServices = (state) => state.services.data
export const selectServicesStatus = (state) => state.services.status
