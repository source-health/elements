import { JWTAuthentication, Source } from '@source-health/client'
import { renderHook } from '@testing-library/react-hooks'
import React, { FC } from 'react'

import { useSourceContext } from '../context/elements'

import { SourceElements } from './SourceElements'

const retrieve = jest.fn()
jest.mock('@source-health/client', () => {
  return {
    Source: () => ({
      members: {
        retrieve,
      },
    }),
    JWTAuthentication: jest.fn(),
  }
})

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

beforeEach(() => {
  retrieve.mockReset()
  retrieve.mockReturnValue(Promise.resolve(member))
})

describe('SourceElements', () => {
  it('with client should create a context that is made available to other components', async () => {
    const wrapper: FC<unknown> = ({ children }) => (
      <SourceElements client={new Source()}>{children}</SourceElements>
    )

    const { result, waitForNextUpdate } = renderHook(() => useSourceContext(), { wrapper })
    await waitForNextUpdate()
    expect(result.current.client).not.toBeNull()
    expect(result.current.member).toBe(member)
    expect(retrieve).toHaveBeenCalledTimes(1)
    expect(retrieve).toHaveBeenCalledWith('current', { expand: ['profile_image'] })
  })

  it('with token should create a context that is made available to other components', async () => {
    const token = new JWTAuthentication('')
    const wrapper: FC<unknown> = ({ children }) => (
      <SourceElements token={token}>{children}</SourceElements>
    )

    const { result, waitForNextUpdate } = renderHook(() => useSourceContext(), { wrapper })

    await waitForNextUpdate()

    expect(result.current.client).not.toBeNull()
    expect(result.current.member).toBe(member)
    expect(retrieve).toHaveBeenCalledTimes(1)
    expect(retrieve).toHaveBeenCalledWith('current', { expand: ['profile_image'] })
  })
})
