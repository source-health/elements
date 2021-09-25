import { renderHook } from '@testing-library/react-hooks'

import { createDelayedPromise, createElementsWrapper } from '../../test/utils'
import { Page, Thread } from '../client'

import { useSourceData } from './useSourceData'

describe('useSourceData', () => {
  const [wrapper, client] = createElementsWrapper()

  it('should handle a successful state', async () => {
    jest.useFakeTimers()
    const response = {
      data: [],
      has_more: false,
    }

    client.listThreads.mockReturnValue(createDelayedPromise(100, response))

    const { result, waitForNextUpdate } = renderHook(
      () => useSourceData((client) => client.listThreads()),
      {
        wrapper,
      },
    )

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBeTruthy()
    expect(result.current.error).toBeNull()

    jest.advanceTimersByTime(150)
    await waitForNextUpdate()

    expect(result.current.data).toEqual(response)
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toBeNull()
  })

  it('should handle a failure statee', async () => {
    jest.useFakeTimers()
    const error = new Error('This request failed')

    client.listThreads.mockReturnValue(createDelayedPromise<Page<Thread>>(100, error))

    const { result, waitForNextUpdate } = renderHook(
      () => useSourceData((client) => client.listThreads()),
      {
        wrapper,
      },
    )

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBeTruthy()
    expect(result.current.error).toBeNull()

    jest.advanceTimersByTime(150)
    await waitForNextUpdate()

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBeFalsy()
    expect(result.current.error).toEqual(error)
  })
})
