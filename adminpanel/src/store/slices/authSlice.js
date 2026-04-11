import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const loginAdmin = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', creds)
    localStorage.setItem('sobha_token', data.token)
    localStorage.setItem('sobha_admin', JSON.stringify(data.admin))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/update-profile', payload)
    localStorage.setItem('sobha_admin', JSON.stringify(data.data))
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/change-password', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const getStoredAdmin = () => {
  try { return JSON.parse(localStorage.getItem('sobha_admin')) } catch { return null }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('sobha_token') || null,
    admin: getStoredAdmin(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.admin = null
      localStorage.removeItem('sobha_token')
      localStorage.removeItem('sobha_admin')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (b) => {
    b
      .addCase(loginAdmin.pending, (s) => { s.loading = true; s.error = null })
      .addCase(loginAdmin.fulfilled, (s, a) => { s.loading = false; s.token = a.payload.token; s.admin = a.payload.admin })
      .addCase(loginAdmin.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(getMe.fulfilled, (s, a) => { s.admin = a.payload })
      .addCase(updateProfile.fulfilled, (s, a) => { s.admin = a.payload })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
