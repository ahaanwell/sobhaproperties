import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../store/slices/projectSlice'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Building2, TrendingUp, CheckCircle, Clock, Home,
  Trees, Store, MapPin, Plus, ArrowRight, Activity
} from 'lucide-react'
import { Spinner, Card, Badge } from '../components/common/UI'

function StatCard({ label, value, icon: Icon, colorClass, bgClass }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bgClass}`}>
        <Icon size={22} className={colorClass} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </Card>
  )
}

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#06b6d4']

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { stats, statsLoading } = useSelector(s => s.projects)

  useEffect(() => { dispatch(fetchDashboardStats()) }, [dispatch])

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Spinner size={36} className="mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Building2 size={40} className="mx-auto mb-3 opacity-30" />
        <p>Failed to load dashboard data.</p>
      </div>
    )
  }

  const statusData = [
    { name: 'Ongoing', value: stats.stats.byStatus.ongoing },
    { name: 'Upcoming', value: stats.stats.byStatus.upcoming },
    { name: 'Completed', value: stats.stats.byStatus.completed },
  ]
  const typeData = [
    { name: 'Apartments', value: stats.stats.byType.apartments },
    { name: 'Villas', value: stats.stats.byType.villas },
    { name: 'Plots', value: stats.stats.byType.plots },
    { name: 'Commercial', value: stats.stats.byType.commercial },
  ]

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/projects/add"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={stats.stats.total} icon={Building2} bgClass="bg-blue-50" colorClass="text-blue-600" />
        <StatCard label="Ongoing" value={stats.stats.byStatus.ongoing} icon={Activity} bgClass="bg-amber-50" colorClass="text-amber-600" />
        <StatCard label="Upcoming" value={stats.stats.byStatus.upcoming} icon={Clock} bgClass="bg-violet-50" colorClass="text-violet-600" />
        <StatCard label="Completed" value={stats.stats.byStatus.completed} icon={CheckCircle} bgClass="bg-emerald-50" colorClass="text-emerald-600" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Apartments" value={stats.stats.byType.apartments} icon={Home} bgClass="bg-cyan-50" colorClass="text-cyan-600" />
        <StatCard label="Villas" value={stats.stats.byType.villas} icon={Trees} bgClass="bg-pink-50" colorClass="text-pink-600" />
        <StatCard label="Plots" value={stats.stats.byType.plots} icon={MapPin} bgClass="bg-orange-50" colorClass="text-orange-600" />
        <StatCard label="Commercial" value={stats.stats.byType.commercial} icon={Store} bgClass="bg-teal-50" colorClass="text-teal-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-800 mb-5">Projects by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-800 mb-5">Projects by Type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">Recent Projects</h3>
          <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Project</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Location</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProjects.map(p => (
                <tr key={p._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img src={p.mainImage} alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0"
                        onError={e => { e.target.src = 'https://placehold.co/40x40/e2e8f0/94a3b8?text=?' }} />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{p.location}</td>
                  <td className="py-3 px-4"><Badge status={p.status} /></td>
                  <td className="py-3 px-4 hidden sm:table-cell"><Badge status={p.propertyType} /></td>
                </tr>
              ))}
              {stats.recentProjects.length === 0 && (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No projects yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
