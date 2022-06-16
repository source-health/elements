import { Source } from '@source-health/client'
import { renderHook } from '@testing-library/react-hooks'
import React, { FC } from 'react'

import { useSourceContext } from '../context/elements'

import { SourceElements } from './SourceElements'

describe('SourceElements', () => {
  it('should create a context that is made available to other components', async () => {
    const member = {
      object: 'member',
      id: 'mem_test',
      title: null,
      first_name: 'Test',
      middle_name: null,
      last_name: 'test',
      preferred_name: '',
      address: null,
      email: null,
      date_of_birth: '',
      care_team: '',
      gender_identity: null,
      sex_at_birth: 'undisclosed',
      administrative_gender: null,
      time_zone: null,
      pronouns: null,
      phone_numbers: [],
      profile_image: null,
      license_region: null,
      tags: [],
      enrollment_status: 'enrolled',
      created_at: '',
      updated_at: '',
    }
    const client = { members: { retrieve: jest.fn() } }
    client.members.retrieve.mockReturnValue(Promise.resolve(member))

    const wrapper: FC<unknown> = ({ children }) => (
      <SourceElements client={client as unknown as Source}>{children}</SourceElements>
    )

    const { result, waitForNextUpdate } = renderHook(() => useSourceContext(), { wrapper })
    await waitForNextUpdate()
    expect(result.current.client).not.toBeNull()
    expect(result.current.member).toBe(member)
  })
})
