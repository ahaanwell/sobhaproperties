import axiosInstance from "@/utils/axiosInstance";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
    blogsList: [],
    blogData: null,
    error: "",
    loading: false
};

export const fetchBlogs = createAsyncThunk("/blogs", async()=>{
    try{
        const {data} = await axiosInstance.get("/blogs");
        // console.log("data", data);
        return data;
    }
    catch(err){
        console.error(err.response?.data?.message)
    }
});

export const fetchBlogBySlug = createAsyncThunk("/blog/slug", async(slug)=>{
    try{
        const {data} = await axiosInstance.get(`/blogs/slug/${slug}`);
        // console.log("data", data);
        return data;
    }
    catch(err){
        console.error(err.response?.data?.message)
    }
})

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchBlogs.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchBlogs.fulfilled, (state, action)=>{
            state.blogsList = action?.payload?.data
            state.loading = false;
        })
        .addCase(fetchBlogs.rejected, (state, action)=>{
            state.error = action.error.message
            state.loading = false;
        })

        builder
        .addCase(fetchBlogBySlug.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchBlogBySlug.fulfilled, (state, action)=>{
            state.blogData = action?.payload?.data;
            state.loading = false;
        })
        .addCase(fetchBlogBySlug.rejected, (state, action)=>{
            state.error = action.error.message
            state.loading = false;
        })
    }
});

export default blogSlice.reducer;