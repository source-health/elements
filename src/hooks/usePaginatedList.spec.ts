import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'

import { createDelayedPromise, createElementsWrapper } from '../../test/utils'

import { usePaginatedList } from './usePaginatedList'

describe('usePaginatedList', () => {
  const [wrapper, client] = createElementsWrapper()
  const error = new Error('Failed to load')
  const thread = {
    id: '123',
    assignee: null,
    subject: '',
    last_message: {
      sender: '',
      sent_at: new Date().toISOString(),
      text: '',
    },
  }

  const thread2 = {
    id: '456',
    assignee: null,
    subject: '',
    last_message: {
      sender: '',
      sent_at: new Date().toISOString(),
      text: '',
    },
  }

  const thread3 = {
    id: '789',
    assignee: null,
    subject: '',
    last_message: {
      sender: '',
      sent_at: new Date().toISOString(),
      text: '',
    },
  }

  it('should load the initial list', async () => {
    jest.useFakeTimers()
    client.listThreads.mockReturnValue(
      createDelayedPromise(100, {
        data: [thread],
        has_more: true,
      }),
    )

    const { result, waitForNextUpdate } = renderHook(
      () =>
        usePaginatedList({
          fetch: (client, paging) => client.listThreads(paging),
        }),
      {
        wrapper,
      },
    )

    expect(result.current.isRefreshing).toBeTruthy()
    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.data).toEqual([])
    expect(result.current.hasNextPage).toBeFalsy()
    expect(result.current.error).toBeNull()

    jest.advanceTimersByTime(150)
    await waitForNextUpdate()

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([thread])
    expect(result.current.hasNextPage).toBeTruthy()
    expect(result.current.error).toBeNull()
  })

  it('should handle failures', async () => {
    jest.useFakeTimers()
    client.listThreads.mockReturnValue(Promise.reject(error))

    const { result, waitForNextUpdate } = renderHook(
      () =>
        usePaginatedList({
          fetch: (client, paging) => client.listThreads(paging),
        }),
      {
        wrapper,
      },
    )

    await waitForNextUpdate()

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([])
    expect(result.current.hasNextPage).toBeFalsy()
    expect(result.current.error).toBe(error)
  })

  it('should load subsequent pages', async () => {
    client.listThreads
      .mockReturnValueOnce(
        Promise.resolve({
          data: [thread],
          has_more: true,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          data: [thread2],
          has_more: true,
        }),
      )
      .mockReturnValueOnce(
        Promise.resolve({
          data: [thread3],
          has_more: false,
        }),
      )

    const { result, waitForNextUpdate } = renderHook(
      () =>
        usePaginatedList({
          fetch: (client, paging) => client.listThreads(paging),
        }),
      {
        wrapper,
      },
    )

    await waitForNextUpdate()

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([thread])
    expect(result.current.hasNextPage).toBeTruthy()
    expect(result.current.error).toBeNull()

    act(() => result.current.fetchNextPage())

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeTruthy()

    await waitForNextUpdate()

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([thread, thread2])
    expect(result.current.hasNextPage).toBeTruthy()
    expect(result.current.error).toBeNull()

    act(() => result.current.fetchNextPage())

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeTruthy()

    await waitForNextUpdate()

    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.data).toEqual([thread, thread2, thread3])
    expect(result.current.hasNextPage).toBeFalsy()
    expect(result.current.error).toBeNull()
  })
})
