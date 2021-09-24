import { renderHook } from '@testing-library/react-hooks'

import { useClassFactory } from './useClassFactory'

describe('useClassFactory', () => {
  it('should generate correct class names', () => {
    const { result } = renderHook(() => useClassFactory('comms', 'test-component'))

    expect(result.current()).toEqual('source-comms__test-component')
    expect(result.current('child')).toEqual('source-comms__test-component--child')
  })
})
