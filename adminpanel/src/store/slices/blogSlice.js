import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const res = await api.get(`/blogs?${query}`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch blogs')
  }
})

export const fetchBlogById = createAsyncThunk('blogs/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/blogs/id/${id}`)
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch blog')
  }
})

export const createBlog = createAsyncThunk('blogs/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create blog')
  }
})

export const updateBlog = createAsyncThunk('blogs/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update blog')
  }
})

export const deleteBlog = createAsyncThunk('blogs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/blogs/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete blog')
  }
})

export const toggleBlogStatus = createAsyncThunk('blogs/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/blogs/${id}/toggle-status`)
    return { id, ...res.data.data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle status')
  }
})

export const toggleBlogFeatured = createAsyncThunk('blogs/toggleFeatured', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/blogs/${id}/toggle-featured`)
    return { id, ...res.data.data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle featured')
  }
})

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    list: [],
    current: null,
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      // fetchBlogs
      .addCase(fetchBlogs.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // fetchBlogById
      .addCase(fetchBlogById.pending, (state) => { state.loading = true })
      .addCase(fetchBlogById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload })
      .addCase(fetchBlogById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // createBlog
      .addCase(createBlog.fulfilled, (state, action) => { state.list.unshift(action.payload) })
      // updateBlog
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.current = action.payload
        state.list = state.list.map(b => b._id === action.payload._id ? action.payload : b)
      })
      // deleteBlog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.list = state.list.filter(b => b._id !== action.payload)
      })
      // toggleStatus
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        state.list = state.list.map(b => b._id === action.payload.id ? { ...b, isActive: action.payload.isActive } : b)
      })
      // toggleFeatured
      .addCase(toggleBlogFeatured.fulfilled, (state, action) => {
        state.list = state.list.map(b => b._id === action.payload.id ? { ...b, isFeatured: action.payload.isFeatured } : b)
      })
  }
})

export const { clearCurrent } = blogSlice.actions
export default blogSlice.reducer