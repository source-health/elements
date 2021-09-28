import { renderHook } from '@testing-library/react-hooks'
import React, { FunctionComponent } from 'react'

import { createElementsWrapper } from '../../../../test/utils'
import { useThreadContext } from '../../../context/thread'

import { Thread } from './Thread'

describe('Thread', () => {
  const [wrapper, client] = createElementsWrapper()
  const ThreadWrapper: FunctionComponent<{ id: string }> = ({ id, children }) =>
    wrapper({
      children: <Thread id={id}>{children}</Thread>,
    })

  it('should load messages', async () => {
    const message = {
      id: 'msg1',
      thread: 'threadTest',
      text: 'Hello!',
      sender: null,
      sent_at: new Date().toISOString(),
    }

    client.listMessages.mockReturnValue(
      Promise.resolve({
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

    expect(client.listMessages).toHaveBeenCalledWith({
      limit: 15,
      thread: 'threadTest',
    })

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
