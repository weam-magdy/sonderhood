import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Config/firebaseConfig";

// Async thunk to fetch blogs
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async () => {
        const blogsCollection = collection(db, "blogs")
        const blogsData = await getDocs(blogsCollection)
        return blogsData.docs.map(blog => ({ ...blog.data(), id: blog.id }))
    }
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
