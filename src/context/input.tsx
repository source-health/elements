import { ChangeEvent, createContext, useContext } from 'react'

import { Callback } from '../types'

export interface MessageInputContextValue {
  /**
   * Current text that has been entered into the input
   */
  text: string

  /**
   * Custom callback function to set the text inside of the context
   */
  setText: Callback<string>

  /**
   * Function to handle a change to the input of a textarea
   */
  handleChange: Callback<ChangeEvent<HTMLTextAreaElement>>

  /**
   * Trigger the current message to send
   */
  send: Callback
}

export const MessageInputContext = createContext<MessageInputContextValue | null>(null)

export function useMessageInputContext(): MessageInputContextValue {
  const value = useContext(MessageInputContext)
  if (!value) {
    throw new Error(
      'Could not find MessageInputContext; You need to wrap this component in the <MessageInput> provider.',
    )
  }

  return value
}
