import { createContext, useContext } from 'react'

export interface ThreadContextValue {
  id: string
}

export const ThreadContext = createContext<ThreadContextValue | null>(null)

export function useThreadContext(): ThreadContextValue {
  const value = useContext(ThreadContext)
  if (!value) {
    throw new Error(
      'Could not find ThreadContext; You need to wrap this component in the <Thread> provider.',
    )
  }

  return value
}
