import type { Source } from '@source-health/client'
import { useCallback, useEffect, useState } from 'react'

import { useSourceClient } from '../context/elements'
import { Callback } from '../types'

interface Identifiable {
  id: string
}

interface PaginationParams {
  starting_after?: string
  ending_before?: string
  limit?: number
}

interface Page<T> {
  object: 'list'
  data: T[]
  has_more: boolean
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

export interface UsePaginatedListArgs<T extends Identifiable> {
  fetch: (client: Source, params: PaginationParams) => Promise<Page<T>>
  isReversed?: boolean
}

export function usePaginatedList<T extends Identifiable>(
  { fetch, isReversed }: UsePaginatedListArgs<T>,
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

    return fetch(client, params ?? {}).then(
      (response) => {
        setState((state) => ({
          ...state,
          isLoading: false,
          isRefreshing: false,
          data: isRefreshing
            ? isReversed
              ? response.data.reverse()
              : response.data
            : isReversed
            ? [...response.data.reverse(), ...state.data]
            : [...state.data, ...response.data],
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
      starting_after: isReversed ? state.data[0].id : state.data[state.data.length - 1].id,
    })
  }, [client, state.data, isReversed, ...dependencies])

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
