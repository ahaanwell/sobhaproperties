import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, SuperAdminRoute, GuestRoute } from './components/common/ProtectedRoute'
import Layout from './components/layout/Layout'
import ToastContainer from './components/common/Toast'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectViewPage from './pages/ProjectViewPage'
import AdminsPage from './pages/AdminsPage'
import ProfilePage from './pages/ProfilePage'
import BlogsPage from './pages/BlogsPage'
import BlogFormPage from './pages/BlogsFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest only */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/add" element={<ProjectFormPage />} />
            <Route path="/projects/:id" element={<ProjectViewPage />} />
            <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
            <Route path="/profile" element={<ProfilePage />} />

<Route path="/blogs" element={<BlogsPage />} />
<Route path="/blogs/new" element={<BlogFormPage />} />
<Route path="/blogs/edit/:id" element={<BlogFormPage />} />
            {/* Super Admin Only */}
            <Route element={<SuperAdminRoute />}>
              <Route path="/admins" element={<AdminsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  )
}
