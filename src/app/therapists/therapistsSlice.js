import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebaseConfig";

// Async thunk to fetch therapists
export const fetchTherapists = createAsyncThunk(
    'therapists/fetchTherapists',
    async () => {
        const therapistsCollection = collection(db, "therapists")
        const therapistsData = await getDocs(therapistsCollection)
        return therapistsData.docs.map(therapist => ({ ...therapist.data(), id: therapist.id }))
    }
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
