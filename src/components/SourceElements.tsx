import type { Source } from '@source-health/client'
import React, { FunctionComponent, useMemo } from 'react'

import { SourceContext, SourceContextValue } from '../context/elements'

export interface SourceElementsProps {
  /**
   * Provide an initialized Source client that elements can use
   */
  client: Source

  /**
   * Override the API base URL to pass to the client
   */
  baseUrl?: string
}

export const SourceElements: FunctionComponent<SourceElementsProps> = ({ client, children }) => {
  const value = useMemo<SourceContextValue>(
    () => ({
      client,
    }),
    [client],
  )

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}
