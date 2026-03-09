import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { closeSidebar } from '../../store/slices/uiSlice'
import {
  LayoutDashboard, Building2, Users, User, LogOut,
  ChevronRight, X, Shield,
  FileText
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: Building2 },
  { label: 'Blogs', path: '/blogs', icon: FileText },
  { label: 'Admins', path: '/admins', icon: Users, superAdminOnly: true },
  { label: 'Profile', path: '/profile', icon: User },
]

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { admin } = useSelector(s => s.auth)
  const { sidebarOpen } = useSelector(s => s.ui)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const navItems = NAV_ITEMS.filter(n => !n.superAdminOnly || admin?.role === 'superadmin')

  return (
    <>
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => dispatch(closeSidebar())} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar flex flex-col z-30 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Sobha Properties</p>
              <p className="text-sidebar-text text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => dispatch(closeSidebar())} className="lg:hidden text-sidebar-text hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => dispatch(closeSidebar())}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-sidebar-hover">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield size={10} className="text-primary-400" />
                <span className="text-sidebar-text text-xs capitalize">{admin?.role}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-text hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
