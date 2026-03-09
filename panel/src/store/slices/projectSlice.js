import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/projects/id/${id}`)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const createProject = createAsyncThunk('projects/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', formData)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const updateProject = createAsyncThunk('projects/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/projects/${id}`, formData)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const toggleProjectStatus = createAsyncThunk('projects/toggle', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/projects/${id}/toggle-status`)
    return { id, isActive: data.data.isActive }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const deleteGalleryImage = createAsyncThunk('projects/deleteGallery', async ({ id, imageUrl }, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/projects/${id}/gallery`, { data: { imageUrl } })
    return { id, gallery: data.data }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchDashboardStats = createAsyncThunk('projects/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects/stats')
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    current: null,
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null },
    clearError(state) { state.error = null },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchProjects.pending, (s) => { s.loading = true })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data; s.total = a.payload.total; s.totalPages = a.payload.totalPages; s.currentPage = a.payload.currentPage })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchProjectById.pending, (s) => { s.loading = true })
      .addCase(fetchProjectById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload })
      .addCase(fetchProjectById.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(deleteProject.fulfilled, (s, a) => { s.list = s.list.filter(p => p._id !== a.payload) })
      .addCase(toggleProjectStatus.fulfilled, (s, a) => { const p = s.list.find(x => x._id === a.payload.id); if (p) p.isActive = a.payload.isActive })
      .addCase(deleteGalleryImage.fulfilled, (s, a) => { if (s.current?._id === a.payload.id) s.current.gallery = a.payload.gallery })
      .addCase(fetchDashboardStats.pending, (s) => { s.statsLoading = true })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => { s.statsLoading = false; s.stats = a.payload })
      .addCase(fetchDashboardStats.rejected, (s) => { s.statsLoading = false })
  },
})

export const { clearCurrent, clearError } = projectSlice.actions
export default projectSlice.reducer
