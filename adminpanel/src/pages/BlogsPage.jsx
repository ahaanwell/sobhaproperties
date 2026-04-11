import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBlogs, deleteBlog, toggleBlogStatus, toggleBlogFeatured } from '../store/slices/blogSlice'
import { useToast } from '../hooks/useToast'
import { Button, Card, Spinner } from '../components/common/UI'
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff,
  Star, StarOff, FileText, Calendar
} from 'lucide-react'

export default function BlogsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { list, loading, total } = useSelector(s => s.blogs)

  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [filterFeatured, setFilterFeatured] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

 useEffect(() => {
  const params = { search }
  if (filterActive !== '') params.isActive = filterActive
  if (filterFeatured !== '') params.isFeatured = filterFeatured
  dispatch(fetchBlogs(params))
}, [search, filterActive, filterFeatured])

  const handleDelete = async () => {
    setDeleting(true)
    const result = await dispatch(deleteBlog(deleteId))
    setDeleting(false)
    setDeleteId(null)
    if (!result.error) toast('Blog deleted successfully')
    else toast(result.payload, 'error')
  }

  const handleToggleStatus = async (id) => {
    const result = await dispatch(toggleBlogStatus(id))
    if (!result.error) toast('Status updated')
    else toast(result.payload, 'error')
  }

  const handleToggleFeatured = async (id) => {
    const result = await dispatch(toggleBlogFeatured(id))
    if (!result.error) toast('Featured status updated')
    else toast(result.payload, 'error')
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} blog{total !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={() => navigate('/blogs/new')}>
          <Plus size={15} /> Add Blog
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select value={filterActive} onChange={e => setFilterActive(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select value={filterFeatured} onChange={e => setFilterFeatured(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="">All Blogs</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
        </div>
      </Card>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : list.length === 0 ? (
        <Card className="text-center py-16">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No blogs found</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Blog" to create your first blog post</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {list.map(blog => (
            <Card key={blog._id} padding={false} className="overflow-hidden">
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="shrink-0">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-28 h-20 object-cover rounded-xl border border-gray-100"
                    onError={e => { e.target.src = 'https://placehold.co/112x80/e2e8f0/94a3b8?text=Blog' }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{blog.title}</h3>
                        {blog.isFeatured && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full shrink-0">
                            ⭐ Featured
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${blog.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {blog.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {blog.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Calendar size={11} />
                        {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(blog._id)}
                        title={blog.isFeatured ? 'Unfeature' : 'Feature'}
                        className="p-2 text-amber-400 hover:bg-amber-50 rounded-lg transition-colors">
                        {blog.isFeatured ? <StarOff size={15} /> : <Star size={15} />}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(blog._id)}
                        title={blog.isActive ? 'Deactivate' : 'Activate'}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        {blog.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                        className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(blog._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Delete Blog?</h3>
              <p className="text-sm text-gray-500 mb-5">This action cannot be undone. The blog and its thumbnail will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}