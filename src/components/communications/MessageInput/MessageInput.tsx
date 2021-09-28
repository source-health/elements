import React, {
  ChangeEvent,
  ComponentType,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { MessageInputContext, MessageInputContextValue } from '../../../context/input'
import { useThreadContext } from '../../../context/thread'

import { MessageInputSimple } from './MessageInputSimple'

export interface MessageInputProps {
  /**
   * Provide a custom message input conponent
   */
  InputComponent?: ComponentType
}

export const MessageInput: FunctionComponent<MessageInputProps> = ({
  InputComponent = MessageInputSimple,
}) => {
  const [text, setText] = useState('')
  const { sendMessage } = useThreadContext()

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.currentTarget.value)
    },
    [setText],
  )

  const send = useCallback(() => {
    sendMessage({
      text,
    })

    setText('')
  }, [text, setText])

  const contextValue: MessageInputContextValue = useMemo(
    () => ({
      text,
      setText,
      handleChange,
      send,
    }),
    [text, setText, handleChange, send],
  )

  return (
    <MessageInputContext.Provider value={contextValue}>
      <InputComponent />
    </MessageInputContext.Provider>
  )
}
