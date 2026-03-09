import axiosInstance from "@/utils/axiosInstance";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
const initialState = {
    projects: [],
    projectData: null,
    loading: false,
    error: ""
};

export const fetchProjects = createAsyncThunk("/projects", async()=>{
    try{
        const {data} = await axiosInstance.get("/projects");
        // console.log("data", data);
        // console.log("data", data);
        return data;
    }
    catch(err){
        console.error(err.response?.data?.message)
    }
});

export const fetchProjectBySlug = createAsyncThunk("/projects/slug", async(slug)=>{
    try{
        const {data} = await axiosInstance.get(`/projects/slug/${slug}`);
        // console.log("data", data);
        // console.log("data", data);
        return data;
    }
    catch(err){
        console.error(err.response?.data?.message)
    }
})
const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchProjects.fulfilled, (state, action)=>{
            // console.log("action", action?.payload);
            state.projects = action?.payload?.data;
        });

        builder
        .addCase(fetchProjectBySlug.pending, (state)=>{
            state.loading = true;
        })
        .addCase(fetchProjectBySlug.fulfilled, (state, action)=>{
            state.projectData = action?.payload?.data;
            state.loading = false;
        })
        .addCase(fetchProjectBySlug.rejected, (state, action)=>{
            state.error = action.error.message
            state.loading = false;
        })
    }
}
)

export default projectSlice.reducer;