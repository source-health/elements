import React, { FunctionComponent, useMemo } from 'react'

import { ThreadContext } from '../../../context/thread'

export interface ThreadProps {
  /**
   * Identifier of the thread that should be rendered
   */
  id: string
}

export const Thread: FunctionComponent<ThreadProps> = ({ id, children }) => {
  const value = useMemo(
    () => ({
      id,
    }),
    [id],
  )

  return <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
}
