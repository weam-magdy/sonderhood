import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadCollection } from "../content";

// Async thunk to fetch testimonials (from the content baked into the build); runs once
export const fetchTestimonials = createAsyncThunk(
    'testimonials/fetchTestimonials',
    () => loadCollection('testimonials'),
    { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().testimonials.status) }
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
