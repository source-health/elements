import { useState, useEffect } from 'react'

import { SourceClient } from '../client'
import { useSourceClient } from '../context/elements'

export function useSourceData<T>(
  handler: (client: SourceClient) => Promise<T>,
  dependencies: unknown[] = [],
): {
  data: T | null
} {
  const client = useSourceClient()
  const [state, setState] = useState({ data: null as T | null })

  useEffect(() => {
    handler(client).then((data) => setState({ data }))
  }, [client, ...dependencies])

  return state
}
