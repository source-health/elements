import { createContext, useContext } from 'react'

import { SourceClient } from '../client/SourceClient'

export interface SourceContextValue {
  /**
   * @private
   *
   * Token used for making API calls.
   *
   * Applications should not access this value directly. It will be provided to API calls
   * transparently by the application
   */
  readonly client: SourceClient
}

export const SourceContext = createContext<SourceContextValue | null>(null)

export function useSourceContext(): SourceContextValue {
  const context = useContext(SourceContext)
  if (!context) {
    throw new Error(
      'Could not find SourceeElements context; You need to wrap your application in a <SourceElements> provider.',
    )
  }

  return context
}

export function useSourceClient(): SourceClient {
  const { client } = useSourceContext()
  return client
}
