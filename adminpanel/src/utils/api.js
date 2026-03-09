import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sobha_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sobha_token')
      localStorage.removeItem('sobha_admin')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
