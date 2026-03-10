import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '../../store/slices/uiSlice'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

const icons = {
  success: <CheckCircle size={18} className="text-emerald-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
}

export default function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts)
  const dispatch = useDispatch()

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 min-w-[300px] max-w-sm fade-in">
          <span className="mt-0.5 shrink-0">{icons[t.type] || icons.info}</span>
          <p className="flex-1 text-sm text-gray-700 font-medium">{t.msg}</p>
          <button onClick={() => dispatch(removeToast(t.id))} className="text-gray-400 hover:text-gray-600 mt-0.5">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
