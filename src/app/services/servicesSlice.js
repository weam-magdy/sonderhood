import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocsFromServer, orderBy, query } from "firebase/firestore";
import { db } from "../../Config/firebaseConfig";

// Async thunk to fetch services
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async () => {
        const servicesCollection = collection(db, "services")
        const servicesData = await getDocsFromServer(query(servicesCollection, orderBy('order')))
        return servicesData.docs.map(service => ({ ...service.data(), id: service.id }))
    }
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
