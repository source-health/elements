import { fireEvent } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'

import { useFocusTracking } from '.'

describe('useFocusTracking', () => {
  it('should track focus state', async () => {
    const element = document.createElement('div')
    const ref = { current: element }

    const { result } = renderHook(() => useFocusTracking(ref))

    expect(result.current).toBeFalsy()

    act(() => {
      fireEvent(element, new Event('focus'))
    })

    expect(result.current).toBeTruthy()

    act(() => {
      fireEvent(element, new Event('blur'))
    })

    expect(result.current).toBeFalsy()
  })
})
