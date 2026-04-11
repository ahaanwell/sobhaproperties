import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchProjects, deleteProject, toggleProjectStatus } from '../store/slices/projectSlice'
import { useToast } from '../hooks/useToast'
import {
  Plus, Search, Eye, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Filter, Building2
} from 'lucide-react'
import { Badge, Button, Spinner, EmptyState, PageHeader } from '../components/common/UI'
import ConfirmDialog from '../components/common/ConfirmDialog'

export default function ProjectsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { list, loading, total, totalPages, currentPage } = useSelector(s => s.projects)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const load = useCallback(() => {
    dispatch(fetchProjects({ page, limit: 10, search, status, propertyType }))
  }, [dispatch, page, search, status, propertyType])

  useEffect(() => { load() }, [load])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleDelete = async () => {
    const result = await dispatch(deleteProject(confirmId))
    if (!result.error) { toast('Project deleted successfully'); load() }
    else toast(result.payload, 'error')
    setConfirmId(null)
  }

  const handleToggle = async (id) => {
    const result = await dispatch(toggleProjectStatus(id))
    if (!result.error) toast('Project status updated')
    else toast(result.payload, 'error')
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Projects"
        subtitle={`${total} project${total !== 1 ? 's' : ''} total`}
        actions={
          <Link to="/projects/add">
            <Button><Plus size={16} /> Add Project</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search projects by name, location, RERA..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select value={propertyType} onChange={e => { setPropertyType(e.target.value); setPage(1) }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : list.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try adjusting your search or filters"
            action={<Link to="/projects/add"><Button><Plus size={14} /> Add Project</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3.5 px-5 text-gray-500 font-medium">Project</th>
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium hidden md:table-cell">Location</th>
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium hidden sm:table-cell">Status</th>
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium hidden lg:table-cell">Type</th>
                  <th className="text-left py-3.5 px-4 text-gray-500 font-medium hidden lg:table-cell">Price</th>
                  <th className="text-center py-3.5 px-4 text-gray-500 font-medium">Active</th>
                  <th className="text-right py-3.5 px-5 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {list.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={p.mainImage} alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                          onError={e => { e.target.src = 'https://placehold.co/44x44/e2e8f0/94a3b8?text=?' }} />
                        <div>
                          <p className="font-semibold text-gray-800">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 hidden md:table-cell">{p.location}</td>
                    <td className="py-3.5 px-4 hidden sm:table-cell"><Badge status={p.status} /></td>
                    <td className="py-3.5 px-4 hidden lg:table-cell"><Badge status={p.propertyType} /></td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700 hidden lg:table-cell">{p.basePrice}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button onClick={() => handleToggle(p._id)} title={p.isActive ? 'Deactivate' : 'Activate'}>
                        {p.isActive
                          ? <ToggleRight size={24} className="text-emerald-500 mx-auto" />
                          : <ToggleLeft size={24} className="text-gray-300 mx-auto" />}
                      </button>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/projects/${p._id}`)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => navigate(`/projects/${p._id}/edit`)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setConfirmId(p._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages} · {total} projects
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = page <= 3 ? i + 1 : page - 2 + i
                if (pg < 1 || pg > totalPages) return null
                return (
                  <button key={pg} onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pg === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-white'}`}>
                    {pg}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmId && (
        <ConfirmDialog
          title="Delete Project?"
          message="This will permanently delete the project and all its images from Cloudinary. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
