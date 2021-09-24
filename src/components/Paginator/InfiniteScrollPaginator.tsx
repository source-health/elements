import React, { FunctionComponent } from 'react'

import { useInfiniteScroll } from '../..'
import { Callback } from '../../types'
import { Loading } from '../Loading'

export interface InfiniteScrollPaginatorProps {
  /**
   *
   */
  hasNextPage: boolean

  /**
   *
   */
  fetchNextPage: Callback

  /**
   *
   */
  isLoading: boolean
}

export const InfiniteScrollPaginator: FunctionComponent<InfiniteScrollPaginatorProps> = ({
  children,
  hasNextPage,
  fetchNextPage,
  isLoading,
}) => {
  const [sentinelRef] = useInfiniteScroll({
    hasNextPage,
    loading: isLoading,
    onLoadMore: fetchNextPage,
    rootMargin: '0px 0px 100px 0px',
  })

  return (
    <div>
      {children}
      {hasNextPage && (
        <div ref={sentinelRef} style={{ padding: '10px' }}>
          {isLoading && <Loading />}
        </div>
      )}
    </div>
  )
}
