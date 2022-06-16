import { ApiKey, CareTeam, Expandable, Source } from '@source-health/client'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import {
  SourceContext,
  SourceContextValue,
  useMember,
  useSourceClient,
  useSourceContext,
} from './elements'

describe('Elements Context', () => {
  it('should return the context value when mounted', () => {
    const value: SourceContextValue = {
      client: new Source(new ApiKey('', '')),
      member: {
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
        care_team: '' as unknown as Expandable<CareTeam>,
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
      },
    }

    const { result } = renderHook(() => useSourceContext(), {
      wrapper: ({ children }) => <SourceContext.Provider value={value} children={children} />,
    })

    expect(result.current.client).toBe(value.client)
    expect(result.current.member).toBe(value.member)
  })

  it('should return the client when mounted', () => {
    const value: SourceContextValue = {
      client: new Source(new ApiKey('', '')),
      member: null,
    }

    const { result } = renderHook(() => useSourceClient(), {
      wrapper: ({ children }) => <SourceContext.Provider value={value} children={children} />,
    })

    expect(result.current).toBe(value.client)
  })

  it('should return the member when mounted', () => {
    const value: SourceContextValue = {
      client: new Source(new ApiKey('', '')),
      member: {
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
        care_team: '' as unknown as Expandable<CareTeam>,
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
      },
    }

    const { result } = renderHook(() => useMember(), {
      wrapper: ({ children }) => <SourceContext.Provider value={value} children={children} />,
    })

    expect(result.current).toBe(value.member)
  })

  it('should throw an error when using a hook without context mounted', () => {
    const { result } = renderHook(() => useSourceContext())
    expect(result.error?.message).toEqual(
      'Could not find SourceElements context; You need to wrap your application in a <SourceElements> provider.',
    )
  })
})
