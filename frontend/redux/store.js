import {configureStore} from "@reduxjs/toolkit";
import projectReducer from "./slices/projectSlice";
import blogReducer from "./slices/blogSlice"
const store = configureStore({
    reducer:{
        project: projectReducer,
        blog: blogReducer
    }
});

export default store;