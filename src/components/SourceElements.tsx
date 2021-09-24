import React, { FunctionComponent, useMemo } from 'react'

import { SourceClient } from '../client/SourceClient'
import { SourceContext, SourceContextValue } from '../context/elements'

const DEFAULT_API_ENDPOINT = 'https://api.withcatalyst.com'

export interface SourceElementsProps {
  /**
   * Token to use when making API calls
   *
   * Typically, this would be a signed JWT identifying which member is currently
   * authenticated with your application.
   */
  readonly token: string

  /**
   * Override the API base URL to pass to the client
   */
  readonly baseUrl?: string
}

export const SourceElements: FunctionComponent<SourceElementsProps> = ({
  baseUrl = DEFAULT_API_ENDPOINT,
  token,
  children,
}) => {
  const value = useMemo<SourceContextValue>(
    () => ({ client: new SourceClient(baseUrl, token) }),
    [baseUrl, token],
  )

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}
