import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { useEffect, useRef, useState } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Heading1, Heading2, Heading3, Quote, Undo, Redo, Code,
  Table as TableIcon, ImageIcon, Trash2, Plus, Minus,
  ChevronDown
} from 'lucide-react'

function ToolbarBtn({ onClick, active, title, children, danger }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`p-1.5 rounded-lg text-sm transition-colors ${
        danger ? 'text-red-500 hover:bg-red-50'
        : active ? 'bg-primary-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-100'
      }`}>
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
}

// ── Image Modal ────────────────────────────────────────────
function ImageModal({ onClose, onInsert }) {
  const [tab, setTab] = useState('url') // 'url' | 'upload'
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const fileRef = useRef()

  const handleUrl = () => {
    if (!url.trim()) return
    onInsert({ src: url.trim(), alt })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onInsert({ src: reader.result, alt: file.name })
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Insert Image</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
          {['url', 'upload'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>
              {t === 'url' ? '🔗 URL' : '📁 Upload'}
            </button>
          ))}
        </div>

        {tab === 'url' ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Image URL *</label>
              <input
                autoFocus
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Alt Text (optional)</label>
              <input
                value={alt}
                onChange={e => setAlt(e.target.value)}
                placeholder="Image description..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button onClick={handleUrl}
              className="w-full bg-primary-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
              Insert Image
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button onClick={() => fileRef.current.click()}
              className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
              <ImageIcon size={24} />
              <span className="text-sm font-medium">Click to choose image</span>
              <span className="text-xs">JPEG, PNG, WEBP, GIF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Table Dropdown ─────────────────────────────────────────
function TableMenu({ editor, onClose }) {
  const btn = (label, action, isDanger) => (
    <button onClick={() => { action(); onClose() }}
      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${isDanger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}>
      {label}
    </button>
  )

  return (
    <div className="absolute top-full left-0 mt-1 z-40 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 min-w-48">
      {btn('Insert Table (3×3)', () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      <div className="border-t border-gray-100 my-1" />
      {btn('Add Row Above', () => editor.chain().focus().addRowBefore().run())}
      {btn('Add Row Below', () => editor.chain().focus().addRowAfter().run())}
      {btn('Delete Row', () => editor.chain().focus().deleteRow().run(), true)}
      <div className="border-t border-gray-100 my-1" />
      {btn('Add Column Before', () => editor.chain().focus().addColumnBefore().run())}
      {btn('Add Column After', () => editor.chain().focus().addColumnAfter().run())}
      {btn('Delete Column', () => editor.chain().focus().deleteColumn().run(), true)}
      <div className="border-t border-gray-100 my-1" />
      {btn('Merge Cells', () => editor.chain().focus().mergeCells().run())}
      {btn('Split Cell', () => editor.chain().focus().splitCell().run())}
      <div className="border-t border-gray-100 my-1" />
      {btn('Delete Table', () => editor.chain().focus().deleteTable().run(), true)}
    </div>
  )
}

// ── Main Editor ────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [showTableMenu, setShowTableMenu] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const insertImage = ({ src, alt }) => {
    editor.chain().focus().setImage({ src, alt }).run()
    setShowImageModal(false)
  }

  return (
    <>
      {showImageModal && (
        <ImageModal onClose={() => setShowImageModal(false)} onInsert={insertImage} />
      )}

      <div className="tiptap-editor border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-100 bg-gray-50">

          {/* History */}
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={15} /></ToolbarBtn>
          <Divider />

          {/* Headings */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1"><Heading1 size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><Heading3 size={15} /></ToolbarBtn>
          <Divider />

          {/* Format */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code"><Code size={15} /></ToolbarBtn>
          <Divider />

          {/* Lists */}
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List"><ListOrdered size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={15} /></ToolbarBtn>
          <Divider />

          {/* Align */}
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={15} /></ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={15} /></ToolbarBtn>
          <Divider />

          {/* Link */}
          <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Add Link"><LinkIcon size={15} /></ToolbarBtn>

          {/* Image */}
          <ToolbarBtn onClick={() => setShowImageModal(true)} title="Insert Image"><ImageIcon size={15} /></ToolbarBtn>

          {/* Table dropdown */}
          <div className="relative">
            <button type="button" onClick={() => setShowTableMenu(p => !p)} title="Table"
              className={`flex items-center gap-0.5 p-1.5 rounded-lg text-sm transition-colors ${editor.isActive('table') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <TableIcon size={15} />
              <ChevronDown size={11} />
            </button>
            {showTableMenu && (
              <TableMenu editor={editor} onClose={() => setShowTableMenu(false)} />
            )}
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>
    </>
  )
}