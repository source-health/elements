import type { File, Message } from '@source-health/client'
import { createContext, useContext } from 'react'

export interface MessageCreateAttachmentInputs {
  /**
   * The file to attach
   */
  file: File

  /**
   * Arbitrary metadata to include on this attachment
   */
  metadata?: Record<string, unknown>
}

export interface MessageCreateInputs {
  /**
   * The message content to send
   */
  text: string

  /**
   * Array of attachments to send (as files). Note that the files must already have been uploaded.
   */
  attachments?: ReadonlyArray<MessageCreateAttachmentInputs>
}

export interface ThreadContextValue {
  id: string

  /**
   * Whether or not the thread is currently being loaded
   */
  isLoading: boolean

  /**
   * The messages known to exist on the thread (an empty array when isLoading = true)
   */
  messages: Message[]

  /**
   * Whether or not there are more messages that can be loaded on the thread
   */
  hasMoreMessages: boolean

  /**
   * Callback to fetch more messages on the thread
   */
  fetchMoreMessages: () => void

  /**
   * Send a message on the thread
   */
  sendMessage: (params: MessageCreateInputs) => Promise<void>
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
