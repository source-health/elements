import { Authentication, Source } from '@source-health/client'
import React, { FunctionComponent, useMemo } from 'react'

import { SourceContext, SourceContextValue } from '../context/elements'

const DEFAULT_API_ENDPOINT = 'https://api.withcatalyst.com'

export interface SourceElementsProps {
  /**
   * Provide a token to use when making API calls, which will be used to initialize the client
   */
  authentication: Authentication

  /**
   * Override the API base URL to pass to the client
   */
  baseUrl?: string
}

export const SourceElements: FunctionComponent<SourceElementsProps> = ({
  baseUrl = DEFAULT_API_ENDPOINT,
  authentication,
  children,
}) => {
  const value = useMemo<SourceContextValue>(
    () => ({
      client: new Source(authentication, {
        baseUrl: baseUrl,
      }),
    }),
    [baseUrl, authentication],
  )

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}
