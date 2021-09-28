import { RefObject, useCallback, useEffect, useState } from 'react'

export function useFocusTracking(ref: RefObject<HTMLElement>): boolean {
  const [isFocused, setIsFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  useEffect(() => {
    ref.current?.addEventListener('focus', handleFocus)
    ref.current?.addEventListener('blur', handleBlur)

    return () => {
      ref.current?.removeEventListener('focus', handleFocus)
      ref.current?.removeEventListener('blur', handleBlur)
    }
  }, [ref])

  return isFocused
}
