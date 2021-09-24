import React, { FunctionComponent, useMemo } from 'react'

import { SourceClient } from '../client/SourceClient'
import { SourceContext, SourceContextValue } from '../context/elements'

export interface SourceElementsProps {
  /**
   * Token to use when making API calls
   *
   * Typically, this would be a signed JWT identifying which member is currently
   * authenticated with your application.
   */
  readonly token: string
}

export const SourceElements: FunctionComponent<SourceElementsProps> = ({ token, children }) => {
  const value = useMemo<SourceContextValue>(
    () => ({ client: new SourceClient('http://localhost:3000', token) }),
    [token],
  )

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}
