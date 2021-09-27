import React, { FunctionComponent } from 'react'

import { Person } from '../../client/Person'

export interface NameProps {
  person: Person | null
}

export const Name: FunctionComponent<NameProps> = ({ person }) => {
  if (!person) {
    return <span>Unknown</span>
  }

  return (
    <span>
      {person.first_name} {person.last_name}
    </span>
  )
}
