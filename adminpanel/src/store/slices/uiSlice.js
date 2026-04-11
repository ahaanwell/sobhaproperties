import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [], sidebarOpen: false },
  reducers: {
    addToast(state, { payload }) {
      state.toasts.push({ id: Date.now(), msg: payload.msg, type: payload.type || 'success' })
    },
    removeToast(state, { payload }) {
      state.toasts = state.toasts.filter(t => t.id !== payload)
    },
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen },
    closeSidebar(state) { state.sidebarOpen = false },
  },
})

export const { addToast, removeToast, toggleSidebar, closeSidebar } = uiSlice.actions
export default uiSlice.reducer
