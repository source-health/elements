import React, { ComponentType, FunctionComponent } from 'react'

import { Thread } from '../../../client'
import { useClassFactory } from '../../../hooks'
import { Loading as DefaultLoading, LoadingProps } from '../../Loading'

export interface ThreadListContainerProps {
  /**
   * Will be true when the list is currently loading
   */
  readonly loading: boolean

  /**
   * List of threads we know about
   */
  readonly threads: Thread[]

  /**
   * Override the loading component with a custom one
   */
  readonly LoadingComponent?: ComponentType<LoadingProps>
}

export const ThreadListContainer: FunctionComponent<ThreadListContainerProps> = ({
  children,
  loading,
  LoadingComponent: Loading = DefaultLoading,
}) => {
  const className = useClassFactory('comms', 'thread-list-container')

  return <div className={className()}>{loading ? <Loading /> : children}</div>
}
