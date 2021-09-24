import React, { FunctionComponent } from 'react'

import { Thread } from '../../../client'
import { useClassFactory, useInfiniteScroll } from '../../../hooks'

export interface ThreadListContainerProps {
  readonly threads: Thread[]
}

export const ThreadListContainer: FunctionComponent<ThreadListContainerProps> = ({ children }) => {
  const className = useClassFactory('comms', 'thread-list-container')
  const [containerRef, scrollableRef] = useInfiniteScroll({
    loading: false,
    hasNextPage: true,
    rootMargin: '0px 0px 50px 0px',
    onLoadMore: () => {
      console.log('load more')
    },
  })

  return (
    <div ref={scrollableRef} className={className()}>
      {children}

      <div ref={containerRef}>Loading More...</div>
    </div>
  )
}
