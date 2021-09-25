import React, { FunctionComponent } from 'react'

export interface LoadingErrorProps {
  error?: Error
}

export const LoadingError: FunctionComponent<LoadingErrorProps> = ({ error }) => {
  if (!error) {
    return null
  }

  return <div>Error: {error?.message}</div>
}
