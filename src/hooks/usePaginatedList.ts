import { useCallback, useEffect, useState } from 'react'

import { Page, PaginationParams, SourceClient } from '../client'
import { useSourceClient } from '../context/elements'
import { Callback } from '../types'

interface Identifiable {
  id: string
}

interface PaginatedState<T extends Identifiable> {
  data: T[]
  hasNextPage: boolean
  isLoading: boolean
  isRefreshing: boolean
  error: Error | null
}

interface PaginatedList<T extends Identifiable> extends PaginatedState<T> {
  data: T[]
  hasNextPage: boolean
  fetchNextPage: Callback
  reset: Callback
  isLoading: boolean
  error: Error | null
}

export function usePaginatedList<T extends Identifiable>(
  callback: (client: SourceClient, params: PaginationParams) => Promise<Page<T>>,
  dependencies: unknown[] = [],
): PaginatedList<T> {
  const client = useSourceClient()
  const [state, setState] = useState<PaginatedState<T>>({
    data: [],
    hasNextPage: false,
    isLoading: false,
    isRefreshing: false,
    error: null,
  })

  const fetchMore = (params?: PaginationParams) => {
    const isRefreshing = !params

    setState((state) => ({
      ...state,
      isLoading: true,
      isRefreshing: isRefreshing,
    }))

    return callback(client, params ?? {}).then(
      (response) => {
        setState((state) => ({
          ...state,
          isLoading: false,
          isRefreshing: false,
          data: isRefreshing ? response.data : [...state.data, ...response.data],
          hasNextPage: response.has_more,
          error: null,
        }))
      },
      (error) => {
        setState((state) => ({
          ...state,
          isLoading: false,
          isRefreshing: false,
          error: error as Error,
        }))
      },
    )
  }

  const fetchNextPage = useCallback(() => {
    if (!state.data.length) {
      return Promise.resolve()
    }

    fetchMore({
      starting_after: state.data[state.data.length - 1].id,
    })
  }, [client, state.data, ...dependencies])

  const reset = useCallback(() => fetchMore(), dependencies)

  useEffect(() => {
    reset()
  }, dependencies)

  return {
    ...state,
    fetchNextPage,
    reset,
  }
}
