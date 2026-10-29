import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadCollection } from "../content";
import { applyTeamChanges } from "../../seo/meta.mjs";

// Async thunk to fetch therapists (from the content baked into the build); runs once.
// Team changes are applied again in case the content came straight from Firestore.
export const fetchTherapists = createAsyncThunk(
    'therapists/fetchTherapists',
    () => loadCollection('therapists').then(applyTeamChanges),
    { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().therapists.status) }
)

export const therapistsSlice = createSlice({
    name: 'therapists',
    initialState: {
        data: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTherapists.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTherapists.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchTherapists.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default therapistsSlice.reducer

export const selectedTherapists = (state) => state.therapists.data
export const selectTherapistsStatus = (state) => state.therapists.status
