import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchProjectById, deleteGalleryImage, clearCurrent } from '../store/slices/projectSlice'
import { useToast } from '../hooks/useToast'
import { Badge, Button, Spinner, Card } from '../components/common/UI'
import ConfirmDialog from '../components/common/ConfirmDialog'
import {
  ArrowLeft, Edit2, MapPin, Hash, Building2, Layers,
  DollarSign, Calendar, Image as Img, HelpCircle, Trash2,
  ToggleLeft, ToggleRight, ExternalLink, Info
} from 'lucide-react'

function Section({ title, icon: Icon, children }) {
  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon size={16} className="text-primary-500" /> {title}
      </h3>
      {children}
    </Card>
  )
}

export default function ProjectViewPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { current, loading } = useSelector(s => s.projects)
  const [deleteImg, setDeleteImg] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    dispatch(fetchProjectById(id))
    return () => dispatch(clearCurrent())
  }, [id])

  const handleDeleteGallery = async () => {
    const result = await dispatch(deleteGalleryImage({ id, imageUrl: deleteImg }))
    if (!result.error) toast('Image deleted successfully')
    else toast(result.payload, 'error')
    setDeleteImg(null)
  }

  if (loading && !current) {
    return <div className="flex justify-center py-20"><Spinner size={32} /></div>
  }
  if (!current) {
    return <div className="text-center py-20 text-gray-400">Project not found</div>
  }

  const p = current
  const contentTabs = [
    { id: 'overview', label: 'Overview', content: p.overviewContent },
    { id: 'floorplan', label: 'Floor Plan', content: p.floorPlanContent },
    { id: 'masterplan', label: 'Master Plan', content: p.masterPlanContent },
    { id: 'priceplan', label: 'Price Plan', content: p.pricePlanContent },
    { id: 'location', label: 'Location', content: p.locationContent },
  ].filter(t => t.content)

  return (
    <div className="fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')}
            className="p-2 rounded-xl hover:bg-white border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{p.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12} />{p.location}</p>
          </div>
        </div>
        <Link to={`/projects/${id}/edit`}>
          <Button variant="secondary"><Edit2 size={15} /> Edit Project</Button>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative mb-6 rounded-2xl overflow-hidden shadow-sm">
        <img src={p.mainImage} alt={p.name} className="w-full h-64 sm:h-80 object-cover bg-gray-100"
          onError={e => { e.target.src = 'https://placehold.co/800x320/e2e8f0/94a3b8?text=No+Image' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-5 left-5 flex items-center gap-2 flex-wrap">
          <Badge status={p.status} />
          {p.propertyType && <Badge status={p.propertyType} />}
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.isActive ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
            {p.isActive ? '● Active' : '● Inactive'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Base Price', value: p.basePrice, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unit Variant', value: p.unitVariant, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'RERA ID', value: p.reraId || 'N/A', icon: Hash, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Slug', value: p.slug, icon: ExternalLink, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="text-center">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={15} className={color} />
            </div>
            <p className="font-bold text-gray-800 text-sm truncate" title={value}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Content Tabs */}
          {contentTabs.length > 0 && (
            <Card padding={false}>
              <div className="flex overflow-x-auto border-b border-gray-100">
                {contentTabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {contentTabs.find(t => t.id === activeTab)?.content
                  ? <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: contentTabs.find(t => t.id === activeTab).content }} />
                  : <p className="text-gray-400 text-sm">No content.</p>}
              </div>
            </Card>
          )}

          {/* Gallery */}
          <Section title={`Gallery (${p.gallery?.length || 0} images)`} icon={Img}>
            {!p.gallery?.length ? (
              <p className="text-gray-400 text-sm text-center py-6">No gallery images</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {p.gallery.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100"
                      onError={e => { e.target.src = 'https://placehold.co/100x100/e2e8f0/94a3b8?text=?' }} />
                    <button onClick={() => setDeleteImg(img)}
                      className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Floor Plans */}
          {p.floorPlans?.length > 0 && (
            <Section title="Floor Plans" icon={Building2}>
              <div className="space-y-2">
                {p.floorPlans.map((fp, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    {fp.floorPlanImage && <img src={fp.floorPlanImage} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0"
                      onError={e => { e.target.src = 'https://placehold.co/64x48/e2e8f0/94a3b8?text=?' }} />}
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{fp.unitType}</p>
                      <p className="text-xs text-gray-500">{fp.price} · {fp.area} sqft</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* FAQ */}
          {p.faqList?.length > 0 && (
            <Section title={`FAQ (${p.faqList.length})`} icon={HelpCircle}>
              <div className="space-y-3">
                {p.faqList.map((faq, i) => (
                  <details key={i} className="bg-gray-50 rounded-xl">
                    <summary className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-800 cursor-pointer select-none">
                      <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                      {faq.question}
                    </summary>
                    <p className="px-4 pb-3 text-sm text-gray-600 ml-7">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <Section title="Project Details" icon={Info}>
            <dl className="space-y-3 text-sm">
              {[
                ['Total Units', p.totalUnits],
                ['Land Area', p.totalLandArea ? `${p.totalLandArea} acres` : null],
                ['Towers', p.totalTowers],
                ['Status', p.status],
                ['Type', p.propertyType],
                ['Possession Time', p.possessionTime],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-medium text-gray-800 capitalize">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {p.moreAbout && (
            <Section title="More About" icon={Info}>
              <p className="text-sm text-gray-600 leading-relaxed">{p.moreAbout}</p>
            </Section>
          )}

          {p.mapLink && (
            <Section title="Location Map" icon={MapPin}>
              <a href={p.mapLink} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:underline text-sm font-medium">
                <ExternalLink size={14} /> Open in Google Maps
              </a>
            </Section>
          )}

          {p.pricePlans?.length > 0 && (
            <Section title="Price Plans" icon={DollarSign}>
              <div className="space-y-2">
                {p.pricePlans.map((pp, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl text-sm">
                    <span className="font-medium text-gray-700">{pp.unitType}</span>
                    <span className="text-gray-500 text-xs">{pp.area} sqft</span>
                    <span className="font-bold text-emerald-600">₹{pp.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {deleteImg && (
        <ConfirmDialog
          title="Delete Gallery Image?"
          message="This will permanently remove the image from Cloudinary."
          onConfirm={handleDeleteGallery}
          onCancel={() => setDeleteImg(null)}
        />
      )}
    </div>
  )
}
