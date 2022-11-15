import type { ApiKey, Member, User } from '@source-health/client'
import React, { FunctionComponent } from 'react'

export interface NameProps {
  person: User | Member | ApiKey | string | null
}

export const Name: FunctionComponent<NameProps> = ({ person }) => {
  if (!person || typeof person === 'string' || person.object === 'api_key') {
    return <span>Unknown</span>
  }

  return (
    <span>
      {person.first_name} {person.last_name}
    </span>
  )
}
