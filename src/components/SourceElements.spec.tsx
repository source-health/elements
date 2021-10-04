import { ApiKey } from '@source-health/client'
import { renderHook } from '@testing-library/react-hooks'
import React, { FC } from 'react'

import { useSourceContext } from '../context/elements'

import { SourceElements } from './SourceElements'

describe('SourceElements', () => {
  it('should create a context that is made available to other components', () => {
    const testToken = new ApiKey('', Math.random().toString(32))
    const wrapper: FC<unknown> = ({ children }) => (
      <SourceElements authentication={testToken}>{children}</SourceElements>
    )

    const { result } = renderHook(() => useSourceContext(), { wrapper })
    expect(result.current.client).not.toBeNull()
  })
})
