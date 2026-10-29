import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadCollection } from "../content";

// Async thunk to fetch blogs (from the content baked into the build); runs once
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    () => loadCollection('blogs'),
    { condition: (_, { getState }) => !['loading', 'succeeded'].includes(getState().blogs.status) }
)

export const blogsSlice = createSlice({
    name: 'blogs',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default blogsSlice.reducer

export const selectedBlogs = (state) => state.blogs.data
export const selectBlogsStatus = (state) => state.blogs.status
