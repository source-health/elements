import type { Member } from '@source-health/client'
import { Source, JWTAuthentication } from '@source-health/client'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'

import { SourceContext, SourceContextValue } from '../context/elements'

export interface DeprecatedSourceElementsProps {
  /**
   * @deprecated provide a token instead
   *
   * Provide an initialized Source client that elements can use
   */
  client: Source

  /**
   * Override the API base URL to pass to the client
   */
  baseUrl?: string
}

export interface SourceElementsProps {
  /**
   * Provide a token that elements can use to create an API client
   */
  token: JWTAuthentication

  /**
   * Override the API base URL to pass to the API client
   */
  baseUrl?: string
}

export const SourceElements: FunctionComponent<
  DeprecatedSourceElementsProps | SourceElementsProps
> = ({ children, baseUrl, ...rest }) => {
  const client = useMemo(() => {
    if ('client' in rest) {
      return rest.client
    } else {
      return new Source(rest.token, { baseUrl })
    }
  }, [(rest as { client: Source }).client || (rest as { token: JWTAuthentication }).token, baseUrl])

  const [member, setMember] = useState<Member | null>(null)
  useEffect(() => {
    client.members.retrieve('current', { expand: ['profile_image'] }).then((member) => {
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
