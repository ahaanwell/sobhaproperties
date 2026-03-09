import { useDispatch } from 'react-redux'
import { addToast, removeToast } from '../store/slices/uiSlice'

export function useToast() {
  const dispatch = useDispatch()

  const toast = (msg, type = 'success') => {
    const id = Date.now()
    dispatch(addToast({ id, msg, type }))
    setTimeout(() => dispatch(removeToast(id)), 3500)
  }

  return toast
}
