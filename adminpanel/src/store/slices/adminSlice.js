import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchAdmins = createAsyncThunk('admins/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/admins')
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const registerAdmin = createAsyncThunk('admins/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const deleteAdmin = createAsyncThunk('admins/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/auth/admins/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const adminSlice = createSlice({
  name: 'admins',
  initialState: { list: [], loading: false, error: null },
  reducers: { clearError(state) { state.error = null } },
  extraReducers: (b) => {
    b
      .addCase(fetchAdmins.pending, (s) => { s.loading = true })
      .addCase(fetchAdmins.fulfilled, (s, a) => { s.loading = false; s.list = a.payload })
      .addCase(fetchAdmins.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(registerAdmin.fulfilled, (s, a) => { if (a.payload) s.list.unshift(a.payload) })
      .addCase(deleteAdmin.fulfilled, (s, a) => { s.list = s.list.filter(x => x._id !== a.payload) })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
