import React, { ComponentType, FunctionComponent } from 'react'

import { useInfiniteScroll } from '../../hooks'
import { Callback } from '../../types'
import { Loading, LoadingProps } from '../Loading'

export interface InfiniteScrollPaginatorProps {
  /**
   * Boolean indicating whether or not there is a next page
   */
  hasNextPage: boolean

  /**
   * Function to call when we want to load another page
   */
  fetchNextPage: Callback

  /**
   * Boolean indicating if another page is currently loading
   */
  isLoading: boolean

  /**
   * Override the loading component
   */
  LoadingComponent?: ComponentType<LoadingProps>
}

export const InfiniteScrollPaginator: FunctionComponent<InfiniteScrollPaginatorProps> = ({
  children,
  hasNextPage,
  fetchNextPage,
  isLoading,
  LoadingComponent = Loading,
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
          {isLoading && <LoadingComponent />}
        </div>
      )}
    </div>
  )
}
