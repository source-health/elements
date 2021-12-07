import type {
  CareTeam,
  MessageCreateParams,
  Message,
  Thread as ThreadResource,
  Expandable,
} from '@source-health/client'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useReducer } from 'react'

import { useSourceClient } from '../../../context/elements'
import { ThreadContext } from '../../../context/thread'

import { threadInitialState, threadReducer } from './reducer'

export interface ThreadProps {
  /**
   * Identifier of the thread that should be rendered
   */
  id: string
}

export const Thread: FunctionComponent<ThreadProps> = ({ id, children }) => {
  const client = useSourceClient()
  const [state, dispatch] = useReducer(threadReducer, threadInitialState)
  const { messages, isLoading, hasMoreMessages } = state

  const sendMessage = useCallback(
    async (params: Omit<MessageCreateParams, 'thread'>) => {
      const message: Message = {
        object: 'message',
        id: `msg_${Math.random().toString(32)}`,
        type: 'text',
        thread: id as unknown as Expandable<ThreadResource>,
        text: params.text,
        sender: {
          object: 'member',
          id: 'mem_test',
          title: null,
          first_name: 'Test',
          middle_name: null,
          last_name: 'test',
          preferred_name: '',
          address: null,
          biological_sex: 'undisclosed',
          email: null,
          date_of_birth: '',
          care_team: '' as unknown as Expandable<CareTeam>,
          created_at: '',
          updated_at: '',
        },
        sent_at: new Date().toISOString(),
        attachments: [],
        impersonated_by: null,
      }

      dispatch({
        type: 'sendMessage',
        message,
      })

      try {
        const created = await client.communications.messages.create(
          {
            ...params,
            thread: id,
          },
          {
            expand: ['sender'],
          },
        )

        dispatch({
          type: 'sendMessageSuccess',
          temporaryMessage: message,
          message: created,
        })
      } catch (ex) {
        dispatch({
          type: 'sendMessageFailure',
          temporaryMessage: message,
        })
      }
    },
    [id],
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
        expand: ['data.sender'],
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
    [id, messages, fetchMoreMessages, hasMoreMessages, isLoading],
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
          expand: ['data.sender', 'data.attachments.resource'],
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
