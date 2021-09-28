import React, { FunctionComponent, useCallback, useEffect, useMemo, useReducer } from 'react'

import { CreateMessageParams, Message } from '../../../client'
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
    async (params: Omit<CreateMessageParams, 'thread'>) => {
      const message: Message = {
        id: `msg_${Math.random().toString(32)}`,
        thread: id,
        text: params.text,
        sender: {
          object: 'member',
          id: 'mem_test',
          first_name: 'Test',
          last_name: 'test',
        },
        sent_at: new Date().toISOString(),
      }

      dispatch({
        type: 'sendMessage',
        message,
      })

      try {
        const created = await client.createMessage({
          ...params,
          thread: id,
        })

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

    const moreMessages = await client.listMessages({
      thread: id,
      starting_after: oldestMessage.id,
    })

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

    client
      .listMessages({
        thread: id,
        limit: 15,
      })
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
