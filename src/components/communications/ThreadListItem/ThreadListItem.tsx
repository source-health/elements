import React, { FunctionComponent, useCallback, useMemo } from 'react'

import { Thread } from '../../../client'
import { useClassFactory } from '../../../hooks'
import { Callback } from '../../../types/callback'

export interface ThreadListItemProps {
  readonly thread: Thread
  readonly onThreadSelected?: Callback<Thread>
}

export const ThreadListItem: FunctionComponent<ThreadListItemProps> = ({
  onThreadSelected,
  thread,
}) => {
  const className = useClassFactory('comms', 'thread-list-item')
  const handleClick = useCallback(() => onThreadSelected?.(thread), [thread])
  const parsedDate = useMemo(
    () => new Date(thread.last_message.sent_at),
    [thread.last_message.sent_at],
  )

  return (
    <div className={className()} onClick={handleClick}>
      <div className={className('topline')}>
        <span className={className('topic')}>{thread.subject ?? '(no subject)'}</span>
        <span className={className('last-message')}>{parsedDate.toUTCString()}</span>
      </div>
      <div className={className('preview')}>{thread.last_message.text}</div>
    </div>
  )
}
