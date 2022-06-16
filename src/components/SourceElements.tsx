import type { Member, Source } from '@source-health/client'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'

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
  const [member, setMember] = useState<Member | null>(null)
  useEffect(() => {
    client.members.retrieve('current').then((member) => {
      setMember(member)
    })
  }, [client])

  const value = useMemo<SourceContextValue>(
    () => ({
      client,
      member,
    }),
    [client, member],
  )

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>
}
