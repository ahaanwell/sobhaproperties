import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, changePassword } from '../store/slices/authSlice'
import { useToast } from '../hooks/useToast'
import { Input, Button, Card, PageHeader, Badge } from '../components/common/UI'
import { User, Lock, Shield, Mail, Calendar, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { admin, loading } = useSelector(s => s.auth)

  const [profileForm, setProfileForm] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleProfile = async () => {
    if (!profileForm.name || !profileForm.email) { toast('Name and email are required', 'error'); return }
    const result = await dispatch(updateProfile(profileForm))
    if (!result.error) toast('Profile updated successfully')
    else toast(result.payload, 'error')
  }

  const handlePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword) { toast('All fields are required', 'error'); return }
    if (pwForm.newPassword !== pwForm.confirm) { toast("New passwords don't match", 'error'); return }
    if (pwForm.newPassword.length < 6) { toast('Password must be at least 6 characters', 'error'); return }
    setPwLoading(true)
    const result = await dispatch(changePassword({ oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }))
    setPwLoading(false)
    if (!result.error) {
      toast('Password changed successfully')
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' })
      setPwSuccess(true)
      setTimeout(() => setPwSuccess(false), 3000)
    } else {
      toast(result.payload, 'error')
    }
  }

  const strength = (pw) => {
    if (!pw) return 0
    let s = 0
    if (pw.length >= 6) s++
    if (pw.length >= 10) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^a-zA-Z0-9]/.test(pw)) s++
    return s
  }
  const pwStrength = strength(pwForm.newPassword)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][pwStrength]
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'][pwStrength]

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <PageHeader title="My Profile" subtitle="Manage your account settings and security" />

      {/* Profile Overview Card */}
      <Card className="mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg">
            {admin?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{admin?.name}</h2>
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
              <Mail size={13} />{admin?.email}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Badge status={admin?.role} />
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} />
                Admin since {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Profile */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <User size={17} className="text-primary-600" /> Update Profile
          </h3>
          <div className="space-y-4">
            <Input label="Full Name" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            <Input label="Email Address" type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" />
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              <p className="flex items-center gap-1.5"><Shield size={12} /> Your role: <strong className="capitalize">{admin?.role}</strong></p>
            </div>
            <Button onClick={handleProfile} loading={loading} className="w-full justify-center">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Lock size={17} className="text-primary-600" /> Change Password
          </h3>
          {pwSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3 mb-4 text-sm">
              <CheckCircle size={15} /> Password changed successfully!
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showOld ? 'text' : 'password'} value={pwForm.oldPassword}
                  onChange={e => setPwForm(p => ({ ...p, oldPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 transition-all" />
                <button type="button" onClick={() => setShowOld(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={pwForm.newPassword}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:border-gray-300 transition-all" />
                <button type="button" onClick={() => setShowNew(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwForm.newPassword && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? strengthColor : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{strengthLabel}</p>
                </div>
              )}
            </div>
            <Input label="Confirm New Password" type="password" value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Re-enter new password"
              error={pwForm.confirm && pwForm.confirm !== pwForm.newPassword ? "Passwords don't match" : ''}
            />
            <Button onClick={handlePassword} loading={pwLoading} className="w-full justify-center">
              <Lock size={14} /> Change Password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
