import { useState, useEffect } from 'react'

import { SourceClient } from '../client'
import { useSourceClient } from '../context/elements'

export function useSourceData<T>(
  handler: (client: SourceClient) => Promise<T>,
  dependencies: unknown[] = [],
): {
  data: T | null
  loading: boolean
  error: Error | null
} {
  const client = useSourceClient()
  const [state, setState] = useState({ data: null as T | null, loading: true, error: null })

  useEffect(() => {
    setState((state) => ({ ...state, loading: true }))

    handler(client)
      .then((data) => setState((state) => ({ ...state, data, loading: false })))
      .catch((error) => setState((state) => ({ ...state, error, loading: false })))
  }, [client, ...dependencies])

  return state
}
