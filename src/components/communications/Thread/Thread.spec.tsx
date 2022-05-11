import { act, renderHook } from '@testing-library/react-hooks'
import React, { FunctionComponent } from 'react'

import { createElementsWrapper } from '../../../../test/utils'
import { useThreadContext } from '../../../context/thread'

import { ThreadProps, Thread } from './Thread'

describe('Thread', () => {
  const [wrapper, client] = createElementsWrapper({
    communications: {
      messages: {
        list: jest.fn(),
        create: jest.fn(),
      },
    },
  })

  const ThreadWrapper: FunctionComponent<ThreadProps> = (props) =>
    wrapper({
      children: <Thread {...props} />,
    })

  it('should load messages', async () => {
    const message = {
      object: 'message' as const,
      id: 'msg1',
      type: 'text' as const,
      thread: 'threadTest',
      text: 'Hello!',
      sender: '',
      sent_at: new Date().toISOString(),
    }

    client.communications.messages.list.mockReturnValue(
      Promise.resolve({
        object: 'list',
        data: [message],
        has_more: false,
      }),
    )

    const { result, waitForNextUpdate } = renderHook(() => useThreadContext(), {
      wrapper: ThreadWrapper,
      initialProps: {
        id: 'threadTest',
      },
    })

    expect(client.communications.messages.list).toHaveBeenCalledWith(
      {
        limit: 15,
        thread: 'threadTest',
      },
      {
        expand: ['data.sender', 'data.attachments.resource'],
      },
    )

    expect(result.current.id).toEqual('threadTest')
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.messages).toEqual([])
    expect(result.current.hasMoreMessages).toBeFalsy()

    await waitForNextUpdate()

    expect(result.current.id).toEqual('threadTest')
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.messages).toEqual([message])
    expect(result.current.hasMoreMessages).toBeFalsy()
  })

  it('should call onSend handler', async () => {
    const message = {
      object: 'message' as const,
      id: 'msg1',
      type: 'text' as const,
      thread: 'threadTest',
      text: 'Hello!',
      sender: '',
      sent_at: new Date().toISOString(),
    }

    client.communications.messages.list.mockReturnValue(
      Promise.resolve({
        object: 'list',
        data: [message],
        has_more: false,
      }),
    )

    client.communications.messages.create.mockReturnValue(
      Promise.resolve({
        object: 'message',
        id: 'asdf',
        sender: {},
      }),
    )

    const onSendHandler = jest.fn()
    const { result, waitForNextUpdate } = renderHook(() => useThreadContext(), {
      wrapper: ThreadWrapper,
      initialProps: {
        id: 'threadTest',
        onSend: onSendHandler,
      },
    })

    await waitForNextUpdate()

    await act(async () => {
      await result.current.sendMessage({
        text: 'Hello World',
      })

      expect(onSendHandler).toHaveBeenCalled()
    })
  })

  it('does not call onSend handler when message send fails', async () => {
    const message = {
      object: 'message' as const,
      id: 'msg1',
      type: 'text' as const,
      thread: 'threadTest',
      text: 'Hello!',
      sender: '',
      sent_at: new Date().toISOString(),
    }

    client.communications.messages.list.mockReturnValue(
      Promise.resolve({
        object: 'list',
        data: [message],
        has_more: false,
      }),
    )

    client.communications.messages.create.mockReturnValue(
      Promise.reject(new Error('Failed to send')),
    )

    const onSendHandler = jest.fn()
    const { result } = renderHook(() => useThreadContext(), {
      wrapper: ThreadWrapper,
      initialProps: {
        id: 'threadTest',
        onSend: onSendHandler,
      },
    })

    await act(async () => {
      try {
        await result.current.sendMessage({
          text: 'Hello World',
        })

        fail('Should have failed')
      } catch (ex) {
        // ignored
      }

      expect(onSendHandler).not.toHaveBeenCalled()
    })
  })
})
