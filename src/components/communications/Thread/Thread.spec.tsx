import { renderHook } from '@testing-library/react-hooks'
import React, { FunctionComponent } from 'react'

import { createElementsWrapper } from '../../../../test/utils'
import { useThreadContext } from '../../../context/thread'

import { Thread } from './Thread'

describe('Thread', () => {
  const [wrapper, client] = createElementsWrapper({
    communications: {
      messages: {
        list: jest.fn(),
      },
    },
  })

  const ThreadWrapper: FunctionComponent<{ id: string }> = ({ id, children }) =>
    wrapper({
      children: <Thread id={id}>{children}</Thread>,
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
})
