import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createProject, updateProject, fetchProjectById, clearCurrent } from '../store/slices/projectSlice'
import { useToast } from '../hooks/useToast'
import RichTextEditor from '../components/common/RichTextEditor'
import { Input, Select, Textarea, Button, Card, Spinner } from '../components/common/UI'
import {
  Save, ArrowLeft, Plus, Trash2, Camera, Image as ImageIcon,
  Info, FileText, AlignLeft, Image, HelpCircle, DollarSign, LayoutList, Upload
} from 'lucide-react'

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'seo', label: 'SEO & Meta', icon: FileText },
  { id: 'content', label: 'Content', icon: AlignLeft },
  { id: 'plans', label: 'Plans & Pricing', icon: DollarSign },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

const DEFAULT_METADATA = {
  title: '', description: '', keywords: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', ogImage: '',
  twitterTitle: '', twitterDescription: '', twitterImage: '',
  twitterCard: 'summary_large_image',
  schemaType: 'Apartment',
  city: '', state: '', pincode: '',
}

const DEFAULT = {
  name: '', slug: '', mapLink: '',
  location: '', unitVariant: '', basePrice: '', totalUnits: '',
  totalLandArea: '', totalTowers: '', status: 'ongoing',
  propertyType: 'apartment', reraId: '', possessionTime: '',
  overviewContent: '', floorPlanContent: '', masterPlanContent: '',
  pricePlanContent: '', locationContent: '', moreAbout: '',
}

export default function ProjectFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { current, loading } = useSelector(s => s.projects)

  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState(DEFAULT)
  const [metadata, setMetadata] = useState(DEFAULT_METADATA)
  const [floorPlans, setFloorPlans] = useState([])
  const [floorPlanFiles, setFloorPlanFiles] = useState([])
  const [pricePlans, setPricePlans] = useState([])
  const [faqList, setFaqList] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [mainImagePreview, setMainImagePreview] = useState(null)
  const [masterPlanImage, setMasterPlanImage] = useState(null)
  const [masterPlanImagePreview, setMasterPlanImagePreview] = useState(null)
  const [gallery, setGallery] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [saving, setSaving] = useState(false)

  const mainRef = useRef()
  const masterPlanRef = useRef()
  const gallRef = useRef()
  const floorPlanRefs = useRef({})

  useEffect(() => {
    if (isEdit) dispatch(fetchProjectById(id))
    return () => dispatch(clearCurrent())
  }, [id])

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        name: current.name || '', slug: current.slug || '',
        mapLink: current.mapLink || '', location: current.location || '',
        unitVariant: current.unitVariant || '', basePrice: current.basePrice || '',
        totalUnits: current.totalUnits || '', totalLandArea: current.totalLandArea || '',
        totalTowers: current.totalTowers || '', status: current.status || 'ongoing',
        propertyType: current.propertyType || 'apartment', reraId: current.reraId || '',
        possessionTime: current.possessionTime || '',
        overviewContent: current.overviewContent || '',
        floorPlanContent: current.floorPlanContent || '',
        masterPlanContent: current.masterPlanContent || '',
        pricePlanContent: current.pricePlanContent || '',
        locationContent: current.locationContent || '',
        moreAbout: current.moreAbout || '',
      })
      // Load metadata from nested object
      setMetadata({
        title: current.metadata?.title || '',
        description: current.metadata?.description || '',
        keywords: current.metadata?.keywords || '',
        canonicalUrl: current.metadata?.canonicalUrl || '',
        ogTitle: current.metadata?.ogTitle || '',
        ogDescription: current.metadata?.ogDescription || '',
        ogImage: current.metadata?.ogImage || '',
        twitterTitle: current.metadata?.twitterTitle || '',
        twitterDescription: current.metadata?.twitterDescription || '',
        twitterImage: current.metadata?.twitterImage || '',
        twitterCard: current.metadata?.twitterCard || 'summary_large_image',
        schemaType: current.metadata?.schemaType || 'Apartment',
        city: current.metadata?.city || '',
        state: current.metadata?.state || '',
        pincode: current.metadata?.pincode || '',
      })
      setFloorPlans(current.floorPlans || [])
      setFloorPlanFiles([])
      setPricePlans(current.pricePlans || [])
      setFaqList(current.faqList || [])
      setMainImagePreview(current.mainImage || null)
      setMasterPlanImagePreview(current.masterPlanImage || null)
    }
  }, [current])

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))
  const rich = key => val => setForm(p => ({ ...p, [key]: val }))
  const meta = key => e => setMetadata(p => ({ ...p, [key]: e.target.value }))

  const handleMainImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMainImage(file)
    setMainImagePreview(URL.createObjectURL(file))
  }

  const handleMasterPlanImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMasterPlanImage(file)
    setMasterPlanImagePreview(URL.createObjectURL(file))
  }

  const handleGallery = (e) => {
    const files = Array.from(e.target.files)
    setGallery(files)
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleFloorPlanImage = (rowIndex, e) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setFloorPlanFiles(prev => {
      const filtered = prev.filter(x => x.rowIndex !== rowIndex)
      return [...filtered, { rowIndex, file, preview }]
    })
  }

  const removeFloorPlan = (rowIndex) => {
    setFloorPlans(p => p.filter((_, j) => j !== rowIndex))
    setFloorPlanFiles(prev =>
      prev
        .filter(x => x.rowIndex !== rowIndex)
        .map(x => x.rowIndex > rowIndex ? { ...x, rowIndex: x.rowIndex - 1 } : x)
    )
  }

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.unitVariant || !form.basePrice) {
      toast('Name, Location, Unit Variant and Base Price are required', 'error')
      setTab('basic')
      return
    }
    if (!isEdit && !mainImage) {
      toast('Main image is required', 'error')
      setTab('media')
      return
    }

    setSaving(true)
    const fd = new FormData()

    // Text fields
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, String(v))
    })

    // Metadata as JSON object
    fd.append('metadata', JSON.stringify(metadata))

    // Images
    if (mainImage) fd.append('mainImage', mainImage)
    if (masterPlanImage) fd.append('masterPlanImage', masterPlanImage)

    // Gallery
    gallery.forEach(file => fd.append('gallery', file))

    // Floor plans
    const floorPlansForServer = floorPlans.map((fp, rowIndex) => {
      const fileEntry = floorPlanFiles.find(x => x.rowIndex === rowIndex)
      if (fileEntry) {
        const uploadIndex = floorPlanFiles.findIndex(x => x.rowIndex === rowIndex)
        return { ...fp, floorPlanImage: '', _imageIndex: uploadIndex }
      }
      return { ...fp }
    })
    fd.append('floorPlans', JSON.stringify(floorPlansForServer))
    floorPlanFiles.forEach(({ file }) => fd.append('floorPlanImages', file))

    fd.append('pricePlans', JSON.stringify(pricePlans))
    fd.append('faqList', JSON.stringify(faqList))

    const result = isEdit
      ? await dispatch(updateProject({ id, formData: fd }))
      : await dispatch(createProject(fd))

    setSaving(false)
    if (!result.error) {
      toast(isEdit ? 'Project updated successfully!' : 'Project created successfully!')
      navigate('/projects')
    } else {
      toast(result.payload, 'error')
    }
  }

  if (isEdit && loading && !current) {
    return <div className="flex justify-center py-20"><Spinner size={32} /></div>
  }

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
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
            <p className="text-sm text-gray-500">{isEdit ? `Editing: ${current?.name}` : 'Fill in the details to create a new project'}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} loading={saving} size="lg">
          <Save size={16} /> {isEdit ? 'Update Project' : 'Save Project'}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Sidebar */}
        <div className="lg:w-52 shrink-0">
          <Card padding={false} className="overflow-hidden sticky top-20">
            {TABS.map(({ id: tid, label, icon: Icon }) => (
              <button key={tid} onClick={() => setTab(tid)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${tab === tid ? 'bg-primary-50 text-primary-700 border-l-2 border-l-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={16} className={tab === tid ? 'text-primary-600' : 'text-gray-400'} />
                {label}
              </button>
            ))}
          </Card>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">

          {/* BASIC INFO */}
          {tab === 'basic' && (
            <Card>
              <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <Info size={17} className="text-primary-600" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Project Name *" value={form.name} onChange={f('name')} placeholder="e.g. Sobha City" />
                <Input label="Custom Slug (optional)" value={form.slug} onChange={f('slug')} placeholder="auto-generated if empty" />
                <Input label="Location *" value={form.location} onChange={f('location')} placeholder="Bangalore, Karnataka" />
                <Input label="Unit Variant *" value={form.unitVariant} onChange={f('unitVariant')} placeholder="2BHK, 3BHK, 4BHK" />
                <Input label="Base Price *" value={form.basePrice} onChange={f('basePrice')} placeholder="₹1.2 Cr onwards" />
                <Input label="RERA ID" value={form.reraId} onChange={f('reraId')} placeholder="PRM/KA/RERA/..." />
                <Input label="Possession Time" value={form.possessionTime} onChange={f('possessionTime')} placeholder="Dec 2030" />
                <Select label="Project Status" value={form.status} onChange={f('status')}>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </Select>
                <Select label="Property Type" value={form.propertyType} onChange={f('propertyType')}>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </Select>
                <Input label="Total Units" type="number" value={form.totalUnits} onChange={f('totalUnits')} placeholder="e.g. 400" />
                <Input label="Total Land Area (acres)" type="number" value={form.totalLandArea} onChange={f('totalLandArea')} placeholder="e.g. 25" />
                <Input label="Total Towers" type="number" value={form.totalTowers} onChange={f('totalTowers')} placeholder="e.g. 6" />
                <Input label="Google Maps Embed URL" value={form.mapLink} onChange={f('mapLink')} placeholder="https://maps.google.com/..." className="sm:col-span-2" />
              </div>
            </Card>
          )}

          {/* SEO & META */}
          {tab === 'seo' && (
            <div className="space-y-5">

              {/* Basic SEO */}
              <Card>
                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <FileText size={17} className="text-primary-600" /> Basic SEO
                </h2>
                <div className="space-y-4">
                  <Input label="Page Title (SEO Title)" value={metadata.title} onChange={meta('title')}
                    placeholder="Best 2BHK in Pune | Sobha Trinity Kharadi" />
                  <Textarea label="Meta Description" rows={3} value={metadata.description}
                    onChange={meta('description')} placeholder="Discover luxury living at Sobha Trinity..." />
                  <Input label="Meta Keywords" value={metadata.keywords} onChange={meta('keywords')}
                    placeholder="2BHK Pune, Sobha Trinity, luxury apartments Kharadi" />
                  <Input label="Canonical URL (optional)" value={metadata.canonicalUrl}
                    onChange={meta('canonicalUrl')} placeholder="https://sobha.com/projects/sobha-trinity" />

                  {/* Google Preview */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-blue-700 mb-2">💡 Google Preview</p>
                    <p className="text-blue-900 font-medium text-base">{metadata.title || form.name || 'Page Title'}</p>
                    <p className="text-green-700 text-xs mt-0.5">https://yoursite.com/projects/{form.slug || 'project-slug'}</p>
                    <p className="text-gray-600 text-xs mt-1">{metadata.description || 'Meta description will appear here...'}</p>
                  </div>
                </div>
              </Card>

              {/* Open Graph */}
              <Card>
                <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <FileText size={17} className="text-primary-600" /> Open Graph
                  <span className="text-xs font-normal text-gray-400">(WhatsApp, Facebook, LinkedIn)</span>
                </h2>
                <p className="text-xs text-gray-400 mb-4">Leave empty to automatically use Basic SEO values.</p>
                <div className="space-y-4">
                  <Input label="OG Title" value={metadata.ogTitle} onChange={meta('ogTitle')}
                    placeholder="Leave empty to use Page Title" />
                  <Textarea label="OG Description" rows={2} value={metadata.ogDescription}
                    onChange={meta('ogDescription')} placeholder="Leave empty to use Meta Description" />
                  <Input label="OG Image URL (1200×630px recommended)" value={metadata.ogImage}
                    onChange={meta('ogImage')} placeholder="https://..." />
                </div>
              </Card>

              {/* Twitter Card */}
              <Card>
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText size={17} className="text-primary-600" /> Twitter Card
                </h2>
                <div className="space-y-4">
                  <Select label="Card Type" value={metadata.twitterCard} onChange={meta('twitterCard')}>
                    <option value="summary_large_image">Large Image</option>
                    <option value="summary">Summary</option>
                  </Select>
                  <Input label="Twitter Title" value={metadata.twitterTitle} onChange={meta('twitterTitle')}
                    placeholder="Leave empty to use OG Title" />
                  <Textarea label="Twitter Description" rows={2} value={metadata.twitterDescription}
                    onChange={meta('twitterDescription')} placeholder="Leave empty to use OG Description" />
                  <Input label="Twitter Image URL" value={metadata.twitterImage}
                    onChange={meta('twitterImage')} placeholder="Leave empty to use OG Image" />
                </div>
              </Card>

              {/* Address & Structured Data */}
              <Card>
                <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                  <FileText size={17} className="text-primary-600" /> Address & Structured Data
                </h2>
                <p className="text-xs text-gray-400 mb-4">Used in JSON-LD schema for Google rich results and local SEO.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <Input label="City" value={metadata.city} onChange={meta('city')} placeholder="Pune" />
                  <Input label="State" value={metadata.state} onChange={meta('state')} placeholder="Maharashtra" />
                  <Input label="Pincode" value={metadata.pincode} onChange={meta('pincode')} placeholder="411014" />
                </div>
                <Select label="Schema Type" value={metadata.schemaType} onChange={meta('schemaType')}>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="SingleFamilyResidence">Single Family Residence</option>
                  <option value="RealEstateListing">Real Estate Listing</option>
                </Select>
              </Card>
            </div>
          )}

          {/* CONTENT */}
          {tab === 'content' && (
            <div className="space-y-5">
              {[
                { key: 'overviewContent', label: 'Overview Content', hint: 'Main description shown on the project page. Include highlights, USPs.' },
                { key: 'floorPlanContent', label: 'Floor Plan Content', hint: 'Description text for the floor plans section.' },
                { key: 'masterPlanContent', label: 'Master Plan Content', hint: 'Text describing the master plan / site layout.' },
                { key: 'pricePlanContent', label: 'Price Plan Content', hint: 'Pricing information, payment plans, offers.' },
                { key: 'locationContent', label: 'Location Content', hint: 'Neighbourhood description, nearby landmarks, connectivity.' },
                { key: 'moreAbout', label: 'More About Project', hint: 'Additional details about the project.' },
              ].map(({ key, label, hint }) => (
                <Card key={key}>
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                    <AlignLeft size={15} className="text-primary-500" /> {label}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{hint}</p>
                  <RichTextEditor value={form[key]} onChange={rich(key)} placeholder={`Write ${label.toLowerCase()} here...`} />
                </Card>
              ))}
            </div>
          )}

          {/* PLANS & PRICING */}
          {tab === 'plans' && (
            <div className="space-y-6">

              {/* Floor Plans */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <LayoutList size={16} className="text-primary-500" /> Floor Plans
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Upload floor plan images directly from your computer</p>
                  </div>
                  <Button size="sm" variant="secondary"
                    onClick={() => setFloorPlans(p => [...p, { unitType: '', price: '', area: '', floorPlanImage: '' }])}>
                    <Plus size={13} /> Add Plan
                  </Button>
                </div>

                {floorPlans.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No floor plans added. Click "Add Plan" to start.</p>
                ) : (
                  <div className="space-y-4">
                    {floorPlans.map((fp, i) => {
                      const fileEntry = floorPlanFiles.find(x => x.rowIndex === i)
                      const imagePreview = fileEntry?.preview || fp.floorPlanImage || null
                      return (
                        <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Floor Plan #{i + 1}</span>
                            <button onClick={() => removeFloorPlan(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="shrink-0">
                              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden"
                                ref={el => floorPlanRefs.current[i] = el}
                                onChange={e => handleFloorPlanImage(i, e)} />
                              {imagePreview ? (
                                <div className="relative group w-36 h-28">
                                  <img src={imagePreview} alt={`Floor plan ${i + 1}`}
                                    className="w-36 h-28 object-cover rounded-xl border border-gray-200"
                                    onError={e => { e.target.src = 'https://placehold.co/144x112/e2e8f0/94a3b8?text=?' }} />
                                  <button onClick={() => floorPlanRefs.current[i]?.click()}
                                    className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={16} className="text-white" />
                                    <span className="text-white text-xs font-medium">Change</span>
                                  </button>
                                  {fileEntry && (
                                    <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-lg font-medium">New</span>
                                  )}
                                </div>
                              ) : (
                                <button onClick={() => floorPlanRefs.current[i]?.click()}
                                  className="w-36 h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                                  <Upload size={20} />
                                  <span className="text-xs font-medium text-center leading-tight">Upload<br />Floor Plan</span>
                                </button>
                              )}
                              <p className="text-xs text-gray-400 mt-1 text-center w-36">JPEG, PNG, WEBP</p>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <Input label="Unit Type *" placeholder="e.g. 2BHK" value={fp.unitType}
                                onChange={e => setFloorPlans(p => p.map((x, j) => j === i ? { ...x, unitType: e.target.value } : x))} />
                              <Input label="Price *" placeholder="e.g. ₹80L" value={fp.price}
                                onChange={e => setFloorPlans(p => p.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} />
                              <Input label="Area (sqft) *" placeholder="e.g. 1200" type="number" value={fp.area}
                                onChange={e => setFloorPlans(p => p.map((x, j) => j === i ? { ...x, area: e.target.value } : x))} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>

              {/* Master Plan Image */}
              <Card>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera size={16} className="text-primary-500" /> Master Plan Image
                </h3>
                <input ref={masterPlanRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleMasterPlanImage} />
                {masterPlanImagePreview ? (
                  <div className="relative inline-block">
                    <img src={masterPlanImagePreview} alt="Master Plan"
                      className="w-full max-w-md h-48 object-cover rounded-2xl border border-gray-100 shadow-sm"
                      onError={e => { e.target.src = 'https://placehold.co/400x192/e2e8f0/94a3b8?text=?' }} />
                    <button onClick={() => masterPlanRef.current.click()}
                      className="absolute bottom-2 right-2 bg-white rounded-xl px-3 py-1.5 text-xs font-medium shadow border border-gray-100 hover:bg-gray-50 flex items-center gap-1">
                      <Camera size={12} /> Change
                    </button>
                  </div>
                ) : (
                  <button onClick={() => masterPlanRef.current.click()}
                    className="w-full max-w-md h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <Camera size={28} />
                    <span className="text-sm font-medium">Click to upload master plan image</span>
                    <span className="text-xs">JPEG, PNG, WEBP up to 5MB</span>
                  </button>
                )}
              </Card>

              {/* Price Plans */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <DollarSign size={16} className="text-primary-500" /> Price Plans
                  </h3>
                  <Button size="sm" variant="secondary"
                    onClick={() => setPricePlans(p => [...p, { unitType: '', price: '', area: '' }])}>
                    <Plus size={13} /> Add Price
                  </Button>
                </div>
                {pricePlans.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No price plans added.</p>
                ) : (
                  <div className="space-y-3">
                    {pricePlans.map((pp, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-xl">
                        <Input placeholder="Unit Type" value={pp.unitType}
                          onChange={e => setPricePlans(p => p.map((x, j) => j === i ? { ...x, unitType: e.target.value } : x))} />
                        <Input placeholder="Price (e.g. ₹80L)" value={pp.price}
                          onChange={e => setPricePlans(p => p.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} />
                        <div className="flex gap-2">
                          <Input placeholder="Area (sqft)" value={pp.area} className="flex-1"
                            onChange={e => setPricePlans(p => p.map((x, j) => j === i ? { ...x, area: e.target.value } : x))} />
                          <button onClick={() => setPricePlans(p => p.filter((_, j) => j !== i))}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* MEDIA */}
          {tab === 'media' && (
            <div className="space-y-5">
              <Card>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera size={16} className="text-primary-500" /> Main Image {!isEdit && <span className="text-red-500">*</span>}
                </h3>
                <input ref={mainRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleMainImage} />
                {mainImagePreview ? (
                  <div className="relative inline-block">
                    <img src={mainImagePreview} alt="Main"
                      className="w-full max-w-md h-48 object-cover rounded-2xl border border-gray-100 shadow-sm"
                      onError={e => { e.target.src = 'https://placehold.co/400x192/e2e8f0/94a3b8?text=?' }} />
                    <button onClick={() => mainRef.current.click()}
                      className="absolute bottom-2 right-2 bg-white rounded-xl px-3 py-1.5 text-xs font-medium shadow border border-gray-100 hover:bg-gray-50 flex items-center gap-1">
                      <Camera size={12} /> Change
                    </button>
                  </div>
                ) : (
                  <button onClick={() => mainRef.current.click()}
                    className="w-full max-w-md h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <Camera size={28} />
                    <span className="text-sm font-medium">Click to upload main image</span>
                    <span className="text-xs">JPEG, PNG, WEBP up to 5MB</span>
                  </button>
                )}
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary-500" /> Gallery Images
                  <span className="text-xs text-gray-400 font-normal">(max 15)</span>
                </h3>
                {isEdit && current?.gallery?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Existing gallery ({current.gallery.length} images) — to delete go to project view page</p>
                    <div className="flex flex-wrap gap-2">
                      {current.gallery.slice(0, 6).map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-12 object-cover rounded-lg border border-gray-100"
                          onError={e => { e.target.src = 'https://placehold.co/64x48/e2e8f0/94a3b8?text=?' }} />
                      ))}
                      {current.gallery.length > 6 && (
                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                          +{current.gallery.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <input ref={gallRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden" onChange={handleGallery} />
                {galleryPreviews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {galleryPreviews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-20 h-16 object-cover rounded-xl border border-gray-100" />
                      ))}
                    </div>
                    <button onClick={() => gallRef.current.click()} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                      <ImageIcon size={13} /> Change selection
                    </button>
                  </div>
                ) : (
                  <button onClick={() => gallRef.current.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <ImageIcon size={24} />
                    <span className="text-sm font-medium">Click to upload gallery images</span>
                    <span className="text-xs">Select multiple files at once</span>
                  </button>
                )}
              </Card>
            </div>
          )}

          {/* FAQ */}
          {tab === 'faq' && (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <HelpCircle size={17} className="text-primary-600" /> FAQ List
                </h3>
                <Button size="sm" variant="secondary"
                  onClick={() => setFaqList(p => [...p, { question: '', answer: '' }])}>
                  <Plus size={13} /> Add FAQ
                </Button>
              </div>
              {faqList.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <HelpCircle size={36} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No FAQs added yet. Click "Add FAQ" to start.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faqList.map((faq, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                        <button onClick={() => setFaqList(p => p.filter((_, j) => j !== i))}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <Input placeholder="Question (e.g. What is the possession date?)" value={faq.question}
                          onChange={e => setFaqList(p => p.map((x, j) => j === i ? { ...x, question: e.target.value } : x))} />
                        <Textarea rows={3} placeholder="Detailed answer..." value={faq.answer}
                          onChange={e => setFaqList(p => p.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} loading={saving} size="lg">
          <Save size={16} /> {isEdit ? 'Update Project' : 'Save Project'}
        </Button>
      </div>
    </div>
  )
}