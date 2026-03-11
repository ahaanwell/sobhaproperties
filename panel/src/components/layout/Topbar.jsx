import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { useLocation, Link } from 'react-router-dom'
import { Menu, ChevronRight, Home } from 'lucide-react'

const BREADCRUMBS = {
  '/': [{ label: 'Dashboard' }],
  '/projects': [{ label: 'Projects', path: '/projects' }],
  '/projects/add': [{ label: 'Projects', path: '/projects' }, { label: 'Add Project' }],
  '/admins': [{ label: 'Admins' }],
  '/profile': [{ label: 'Profile' }],
}

export default function Topbar() {
  const dispatch = useDispatch()
  const { admin } = useSelector(s => s.auth)
  const location = useLocation()

  const path = location.pathname
  const isEdit = path.startsWith('/projects/') && path.includes('/edit')
  const crumbs = isEdit
    ? [{ label: 'Projects', path: '/projects' }, { label: 'Edit Project' }]
    : (BREADCRUMBS[path] || [{ label: '—' }])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10 shadow-sm">
      <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600">
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          <Home size={14} />
        </Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight size={13} className="text-gray-300" />
            {c.path
              ? <Link to={c.path} className="text-gray-500 hover:text-primary-600 font-medium transition-colors">{c.label}</Link>
              : <span className="text-gray-800 font-semibold">{c.label}</span>
            }
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {admin?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{admin?.name}</span>
        </div>
      </div>
    </header>
  )
}
