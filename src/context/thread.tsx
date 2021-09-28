import { createContext, useContext } from 'react'

import { CreateMessageParams, Message } from '../client'

export interface ThreadContextValue {
  id: string

  /**
   *
   */
  isLoading: boolean

  /**
   *
   */
  messages: Message[]

  /**
   *
   */
  hasMoreMessages: boolean

  /**
   *
   */
  fetchMoreMessages: () => void

  /**
   *
   */
  sendMessage: (params: Omit<CreateMessageParams, 'thread'>) => Promise<void>
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
