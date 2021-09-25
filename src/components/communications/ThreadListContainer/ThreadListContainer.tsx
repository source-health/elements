import React, { ComponentType, FunctionComponent } from 'react'

import { Thread } from '../../../client'
import { useClassFactory } from '../../../hooks'
import { Loading, LoadingError, LoadingErrorProps, LoadingProps } from '../../Loading'

export interface ThreadListContainerProps {
  /**
   * Will be true when the list is currently loading
   */
  loading: boolean

  /**
   * Error encountered when loading, if anys
   */
  error: Error | null

  /**
   * List of threads we know about
   */
  threads: Thread[]

  /**
   * Override the loading component with a custom one
   */
  LoadingComponent?: ComponentType<LoadingProps>

  /**
   * Override the component that renders an error message
   */
  LoadingErrorComponent?: ComponentType<LoadingErrorProps>
}

export const ThreadListContainer: FunctionComponent<ThreadListContainerProps> = ({
  children,
  error,
  loading,
  LoadingComponent = Loading,
  LoadingErrorComponent = LoadingError,
}) => {
  const className = useClassFactory('comms', 'thread-list-container')

  if (error) {
    return <LoadingErrorComponent error={error} />
  }

  if (loading) {
    return <LoadingComponent />
  }

  return <div className={className()}>{children}</div>
}
