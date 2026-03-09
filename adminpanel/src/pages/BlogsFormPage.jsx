import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, updateBlog, fetchBlogById, clearCurrent } from '../store/slices/blogSlice'
import { useToast } from '../hooks/useToast'
import RichTextEditor from '../components/common/RichTextEditor'
import { Input, Select, Textarea, Button, Card, Spinner } from '../components/common/UI'
import {
  Save, ArrowLeft, Camera, Info, FileText, AlignLeft
} from 'lucide-react'

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: Info },
  { id: 'content', label: 'Content', icon: AlignLeft },
  { id: 'seo', label: 'SEO & Meta', icon: FileText },
]

const DEFAULT_METADATA = {
  title: '', description: '', keywords: '', canonicalUrl: '',
  ogTitle: '', ogDescription: '', ogImage: '',
  twitterTitle: '', twitterDescription: '', twitterImage: '',
  twitterCard: 'summary_large_image',
}

const DEFAULT = {
  title: '', slug: '', excerpt: '',
  isActive: true, isFeatured: false,
}

export default function BlogFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const { current, loading } = useSelector(s => s.blogs)

  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState(DEFAULT)
  const [content, setContent] = useState('')
  const [metadata, setMetadata] = useState(DEFAULT_METADATA)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const thumbRef = useRef()

  useEffect(() => {
    if (isEdit) dispatch(fetchBlogById(id))
    return () => dispatch(clearCurrent())
  }, [id])

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        title: current.title || '',
        slug: current.slug || '',
        excerpt: current.excerpt || '',
        isActive: current.isActive ?? true,
        isFeatured: current.isFeatured ?? false,
      })
      setContent(current.content || '')
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
      })
      setThumbnailPreview(current.thumbnail || null)
    }
  }, [current])

  const f = key => e => setForm(p => ({ ...p, [key]: e.target.value }))
  const fBool = key => e => setForm(p => ({ ...p, [key]: e.target.value === 'true' }))
  const meta = key => e => setMetadata(p => ({ ...p, [key]: e.target.value }))

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!form.title) {
      toast('Blog title is required', 'error')
      setTab('basic')
      return
    }
    if (!content) {
      toast('Blog content is required', 'error')
      setTab('content')
      return
    }
    if (!isEdit && !thumbnail) {
      toast('Thumbnail is required', 'error')
      setTab('basic')
      return
    }

    setSaving(true)
    const fd = new FormData()

    Object.entries(form).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) fd.append(k, String(v))
    })

    fd.append('content', content)
    fd.append('metadata', JSON.stringify(metadata))
    if (thumbnail) fd.append('thumbnail', thumbnail)

    const result = isEdit
      ? await dispatch(updateBlog({ id, formData: fd }))
      : await dispatch(createBlog(fd))

    setSaving(false)
    if (!result.error) {
      toast(isEdit ? 'Blog updated successfully!' : 'Blog created successfully!')
      navigate('/blogs')
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
          <button onClick={() => navigate('/blogs')}
            className="p-2 rounded-xl hover:bg-white border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Blog' : 'Add New Blog'}</h1>
            <p className="text-sm text-gray-500">{isEdit ? `Editing: ${current?.title}` : 'Fill in the details to create a new blog post'}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} loading={saving} size="lg">
          <Save size={16} /> {isEdit ? 'Update Blog' : 'Save Blog'}
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
            <div className="space-y-5">
              <Card>
                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <Info size={17} className="text-primary-600" /> Basic Information
                </h2>
                <div className="space-y-4">
                  <Input label="Blog Title *" value={form.title} onChange={f('title')} placeholder="e.g. Top 5 Reasons to Invest in Pune Real Estate" />
                  <Input label="Custom Slug (optional)" value={form.slug} onChange={f('slug')} placeholder="auto-generated if empty" />
                  <Textarea label="Excerpt (Short Summary)" rows={3} value={form.excerpt} onChange={f('excerpt')}
                    placeholder="Brief summary shown in blog listing cards..." />
                  <div className="grid grid-cols-2 gap-4">
                    <Select label="Status" value={String(form.isActive)} onChange={fBool('isActive')}>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Select>
                    <Select label="Featured" value={String(form.isFeatured)} onChange={fBool('isFeatured')}>
                      <option value="false">Not Featured</option>
                      <option value="true">Featured</option>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Thumbnail */}
              <Card>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera size={16} className="text-primary-500" /> Thumbnail {!isEdit && <span className="text-red-500">*</span>}
                </h3>
                <input ref={thumbRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleThumbnail} />
                {thumbnailPreview ? (
                  <div className="relative inline-block">
                    <img src={thumbnailPreview} alt="Thumbnail"
                      className="w-full max-w-md h-48 object-cover rounded-2xl border border-gray-100 shadow-sm"
                      onError={e => { e.target.src = 'https://placehold.co/400x192/e2e8f0/94a3b8?text=?' }} />
                    <button onClick={() => thumbRef.current.click()}
                      className="absolute bottom-2 right-2 bg-white rounded-xl px-3 py-1.5 text-xs font-medium shadow border border-gray-100 hover:bg-gray-50 flex items-center gap-1">
                      <Camera size={12} /> Change
                    </button>
                  </div>
                ) : (
                  <button onClick={() => thumbRef.current.click()}
                    className="w-full max-w-md h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <Camera size={28} />
                    <span className="text-sm font-medium">Click to upload thumbnail</span>
                    <span className="text-xs">JPEG, PNG, WEBP up to 5MB</span>
                  </button>
                )}
              </Card>
            </div>
          )}

          {/* CONTENT */}
          {tab === 'content' && (
            <Card>
              <h2 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <AlignLeft size={17} className="text-primary-600" /> Blog Content
              </h2>
              <p className="text-xs text-gray-400 mb-4">Write your full blog post here. Supports headings, images, tables, lists and more.</p>
              <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your blog post..." />
            </Card>
          )}

          {/* SEO */}
          {tab === 'seo' && (
            <div className="space-y-5">
              {/* Basic SEO */}
              <Card>
                <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                  <FileText size={17} className="text-primary-600" /> Basic SEO
                </h2>
                <div className="space-y-4">
                  <Input label="Page Title" value={metadata.title} onChange={meta('title')}
                    placeholder="Leave empty to use Blog Title" />
                  <Textarea label="Meta Description" rows={3} value={metadata.description}
                    onChange={meta('description')} placeholder="Brief description for search engines..." />
                  <Input label="Meta Keywords" value={metadata.keywords} onChange={meta('keywords')}
                    placeholder="real estate pune, property investment, sobha..." />
                  <Input label="Canonical URL (optional)" value={metadata.canonicalUrl}
                    onChange={meta('canonicalUrl')} placeholder="https://sobha.com/blogs/your-blog-slug" />

                  {/* Preview */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                    <p className="font-semibold text-blue-700 mb-2">💡 Google Preview</p>
                    <p className="text-blue-900 font-medium">{metadata.title || form.title || 'Blog Title'}</p>
                    <p className="text-green-700 text-xs mt-0.5">https://yoursite.com/blogs/{form.slug || 'blog-slug'}</p>
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
                <p className="text-xs text-gray-400 mb-4">Leave empty to use Basic SEO values.</p>
                <div className="space-y-4">
                  <Input label="OG Title" value={metadata.ogTitle} onChange={meta('ogTitle')}
                    placeholder="Leave empty to use Page Title" />
                  <Textarea label="OG Description" rows={2} value={metadata.ogDescription}
                    onChange={meta('ogDescription')} placeholder="Leave empty to use Meta Description" />
                  <Input label="OG Image URL (1200×630px)" value={metadata.ogImage}
                    onChange={meta('ogImage')} placeholder="Leave empty to use Thumbnail" />
                </div>
              </Card>

              {/* Twitter */}
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
            </div>
          )}
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} loading={saving} size="lg">
          <Save size={16} /> {isEdit ? 'Update Blog' : 'Save Blog'}
        </Button>
      </div>
    </div>
  )
}