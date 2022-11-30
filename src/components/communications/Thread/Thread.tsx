import type { Expandable, Message, Thread as ThreadResource } from '@source-health/client'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useReducer } from 'react'

import { useMember, useSourceClient } from '../../../context/elements'
import { MessageCreateInputs, ThreadContext } from '../../../context/thread'

import { threadInitialState, threadReducer } from './reducer'

export interface ThreadProps {
  /**
   * Identifier of the thread that should be rendered
   */
  id: string

  /**
   * Callback invoked when a message is sent using elements
   */
  onSend?: () => void
}

export const Thread: FunctionComponent<ThreadProps> = ({ id, children, onSend }) => {
  const client = useSourceClient()
  const member = useMember()
  const [state, dispatch] = useReducer(threadReducer, threadInitialState)
  const { messages, isLoading, hasMoreMessages } = state

  const sendMessage = useCallback(
    async (params: MessageCreateInputs) => {
      if (!member) {
        return
      }

      const message: Message = {
        object: 'message',
        id: `msg_${Math.random().toString(32)}`,
        type: 'text',
        thread: id as unknown as Expandable<ThreadResource>,
        text: params.text,
        sender: member,
        channel_type: 'chat',
        channel: null,
        to: null,
        from: null,
        direction: 'inbound',
        status: 'pending',
        sent_at: new Date().toISOString(),
        attachments:
          params.attachments?.map((attachment) => ({
            type: 'file',
            description: attachment.file.name,
            url: attachment.file.url,
            metadata: attachment.metadata ?? {},
            resource: attachment.file,
          })) ?? [],
        impersonated_by: null,
        redacted_at: null,
      }

      dispatch({
        type: 'sendMessage',
        message,
      })

      try {
        const created = await client.communications.messages.create(
          {
            text: params.text,
            thread: id,
            attachments:
              params.attachments?.map((attachment) => ({
                type: 'file',
                resource: attachment.file.id,
                metadata: attachment.metadata ?? {},
              })) ?? [],
          },
          {
            expand: ['sender', 'sender.profile_image', 'attachments.resource'],
          },
        )

        dispatch({
          type: 'sendMessageSuccess',
          temporaryMessage: message,
          message: created,
        })

        onSend?.()
      } catch (ex) {
        dispatch({
          type: 'sendMessageFailure',
          temporaryMessage: message,
        })
      }
    },
    [id, member],
  )

  const fetchMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoading) {
      return
    }

    const oldestMessage = messages[0]

    dispatch({
      type: 'loadMoreMessages',
    })

    const moreMessages = await client.communications.messages.list(
      {
        thread: id,
        starting_after: oldestMessage.id,
      },
      {
        expand: ['data.sender', 'data.sender.profile_image', 'data.attachments.resource'],
      },
    )

    dispatch({
      type: 'loadMoreMessagesSuccess',
      messages: moreMessages.data.reverse(),
      hasMore: moreMessages.has_more,
    })
  }, [id, messages, isLoading, hasMoreMessages])

  const value = useMemo(
    () => ({
      id,
      isLoading,
      messages,
      hasMoreMessages: hasMoreMessages,
      fetchMoreMessages: fetchMoreMessages,
      sendMessage,
    }),
    [id, messages, fetchMoreMessages, sendMessage, hasMoreMessages, isLoading],
  )

  useEffect(() => {
    dispatch({ type: 'initializeThread', id })

    client.communications.messages
      .list(
        {
          thread: id,
          limit: 15,
        },
        {
          expand: ['data.sender', 'data.sender.profile_image', 'data.attachments.resource'],
        },
      )
      .then((messages) => {
        dispatch({
          type: 'initializeThreadSuccess',
          messages: messages.data.reverse(),
          hasMore: messages.has_more,
        })
      })
  }, [id])

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
}
