import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocsFromServer } from "firebase/firestore";
import { db } from "../../Config/firebaseConfig";

// Async thunk to fetch testimonials
export const fetchTestimonials = createAsyncThunk(
    'testimonials/fetchTestimonials',
    async () => {
        const testimonialsCollection = collection(db, "testimonials")
        const testimonialsData = await getDocsFromServer(testimonialsCollection)
        return testimonialsData.docs.map(testimonial => ({ ...testimonial.data(), id: testimonial.id }))
    }
)

export const testimonialsSlice = createSlice({
    name: 'testimonials',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTestimonials.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default testimonialsSlice.reducer

export const selectedTestimonials = (state) => state.testimonials.data
export const selectTestimonialsStatus = (state) => state.testimonials.status
