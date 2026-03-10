import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdmins, registerAdmin, deleteAdmin } from '../store/slices/adminSlice'
import { useToast } from '../hooks/useToast'
import { Badge, Button, Input, Select, Spinner, PageHeader, Card, EmptyState } from '../components/common/UI'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { Plus, Trash2, X, Users, Shield, Calendar, Mail } from 'lucide-react'

function RegisterModal({ onClose, onSaved, toast }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { toast('All fields are required', 'error'); return }
    if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return }
    setLoading(true)
    const result = await dispatch(registerAdmin(form))
    setLoading(false)
    if (!result.error) { toast('Admin registered successfully'); onSaved() }
    else toast(result.payload, 'error')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Register New Admin</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
          <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@sobha.com" />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" />
          <Select label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </Select>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ Super Admins have full access including managing other admins.
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={loading} onClick={handleSubmit}>Register Admin</Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminsPage() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { list, loading } = useSelector(s => s.admins)
  const { admin: currentAdmin } = useSelector(s => s.auth)
  const [showModal, setShowModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => { dispatch(fetchAdmins()) }, [dispatch])

  const handleDelete = async () => {
    const result = await dispatch(deleteAdmin(confirmId))
    if (!result.error) toast('Admin deleted successfully')
    else toast(result.payload, 'error')
    setConfirmId(null)
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Admins"
        subtitle={`${list.length} admin${list.length !== 1 ? 's' : ''} registered`}
        actions={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Admin</Button>}
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(admin => (
            <Card key={admin._id} className="relative">
              {admin._id === currentAdmin._id && (
                <span className="absolute top-3 right-3 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">You</span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {admin.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{admin.name}</p>
                  <Badge status={admin.role} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={13} className="shrink-0" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={13} className="shrink-0" />
                  <span>Joined {new Date(admin.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              {admin._id !== currentAdmin._id && (
                <button onClick={() => setConfirmId(admin._id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
                  <Trash2 size={14} /> Remove Admin
                </button>
              )}
            </Card>
          ))}
          {list.length === 0 && (
            <div className="col-span-3">
              <EmptyState title="No admins found" description="Register the first admin to get started" action={<Button onClick={() => setShowModal(true)}><Plus size={14} /> Add Admin</Button>} />
            </div>
          )}
        </div>
      )}

      {showModal && <RegisterModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); dispatch(fetchAdmins()) }} toast={toast} />}
      {confirmId && (
        <ConfirmDialog
          title="Remove Admin?"
          message="This admin will lose all access to the panel immediately."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}
