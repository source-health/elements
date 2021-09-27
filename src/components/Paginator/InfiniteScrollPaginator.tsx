import React, { ComponentType, FunctionComponent, RefObject } from 'react'

import { useInfiniteScroll, useMergeRefs } from '../../hooks'
import { Callback } from '../../types'
import { Loading, LoadingProps } from '../Loading'

export interface InfiniteScrollPaginatorProps {
  scrollableRef?: RefObject<HTMLDivElement>

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
   * Boolean indicating if this infinite scroller should be reversed (trigger more when scrolling to top)
   */
  isReversed?: boolean

  /**
   * Override the loading component
   */
  LoadingComponent?: ComponentType<LoadingProps>
}

export const InfiniteScrollPaginator: FunctionComponent<InfiniteScrollPaginatorProps> = ({
  children,
  hasNextPage,
  fetchNextPage,
  scrollableRef,
  isLoading,
  isReversed = false,
  LoadingComponent = Loading,
}) => {
  const [sentinelRef, containerRef] = useInfiniteScroll({
    hasNextPage,
    loading: isLoading,
    onLoadMore: fetchNextPage,
    rootMargin: isReversed ? '50px 0px 0px 0px' : '0px 0px 50px 0px',
  })

  return (
    <div
      style={{ maxHeight: '400px', overflow: 'auto' }}
      ref={useMergeRefs<HTMLDivElement>(containerRef, scrollableRef)}
    >
      {isReversed && hasNextPage && (
        <div ref={sentinelRef} style={{ padding: '10px' }}>
          {isLoading && <LoadingComponent />}
        </div>
      )}
      {children}
      {!isReversed && hasNextPage && (
        <div ref={sentinelRef} style={{ padding: '10px' }}>
          {isLoading && <LoadingComponent />}
        </div>
      )}
    </div>
  )
}
