import React, {
  ForwardedRef,
  forwardRef,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react'

import { useMergeRefs } from '../../hooks'

export interface AutosizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxHeight?: number
}

export const AutosizeTextarea = forwardRef<HTMLTextAreaElement, AutosizeTextareaProps>(
  ({ maxHeight, ...attrs }, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const innerRef = useRef<HTMLTextAreaElement>(null)
    const actualRef = useMergeRefs<HTMLTextAreaElement>(ref, innerRef)
    const handleInput = useCallback(() => {
      const input = innerRef.current
      if (!input) {
        return
      }

      input.style.height = '0px'
      input.style.height = maxHeight
        ? `${Math.max(input.scrollHeight, maxHeight)}px`
        : `${input.scrollHeight}px`
    }, [innerRef, maxHeight])

    useEffect(() => {
      handleInput()
      innerRef.current?.addEventListener('input', handleInput)
      return () => innerRef.current?.removeEventListener('input', handleInput)
    }, [innerRef, handleInput])

    return <textarea ref={actualRef} {...attrs} />
  },
)
