import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { SourceClient } from '../client'

import { SourceContext, SourceContextValue, useSourceClient, useSourceContext } from './elements'

describe('Elements Context', () => {
  it('should return the context value when mounted', () => {
    const value: SourceContextValue = {
      client: new SourceClient('', ''),
    }

    const { result } = renderHook(() => useSourceContext(), {
      wrapper: ({ children }) => <SourceContext.Provider value={value} children={children} />,
    })

    expect(result.current.client).toBe(value.client)
  })

  it('should return the client when mounted', () => {
    const value: SourceContextValue = {
      client: new SourceClient('', ''),
    }

    const { result } = renderHook(() => useSourceClient(), {
      wrapper: ({ children }) => <SourceContext.Provider value={value} children={children} />,
    })

    expect(result.current).toBe(value.client)
  })

  it('should throw an error when using a hook without context mounted', () => {
    const { result } = renderHook(() => useSourceContext())
    expect(result.error?.message).toEqual(
      'Could not find SourceElements context; You need to wrap your application in a <SourceElements> provider.',
    )
  })
})
