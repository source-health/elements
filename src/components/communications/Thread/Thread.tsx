import React, { FunctionComponent, useMemo } from 'react'

import { ThreadContext } from '../../../context/thread'
import { usePaginatedList } from '../../../hooks'

export interface ThreadProps {
  /**
   * Identifier of the thread that should be rendered
   */
  id: string
}

export const Thread: FunctionComponent<ThreadProps> = ({ id, children }) => {
  const { data, isLoading, hasNextPage, fetchNextPage } = usePaginatedList(
    {
      fetch: (client, paging) =>
        client.listMessages({
          thread: id,
          ...paging,
        }),
      isReversed: true,
    },
    [id],
  )

  const value = useMemo(
    () => ({
      id,
      messages: data,
      hasMoreMessages: hasNextPage,
      fetchMoreMessages: fetchNextPage,
      isLoading,
    }),
    [id, data, hasNextPage, fetchNextPage, isLoading],
  )

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
}
