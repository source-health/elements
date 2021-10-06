import type { Thread } from '@source-health/client'
import React, { ComponentType, FunctionComponent, useCallback, useMemo } from 'react'

import { useClassFactory } from '../../../hooks'
import { Callback } from '../../../types'
import { Avatar, AvatarProps } from '../../Avatar'

export interface ThreadListItemProps {
  /**
   * The thread that should be rendered in this component
   */
  thread: Thread

  /**
   * Callback to invoke when the thread is clicked/tapped
   */
  onThreadSelected?: Callback<Thread>
  /**
   * Custom Avatar component override
   */
  AvatarComponent?: ComponentType<AvatarProps>
}

export const ThreadListItem: FunctionComponent<ThreadListItemProps> = ({
  onThreadSelected,
  thread,
  AvatarComponent = Avatar,
}) => {
  const className = useClassFactory('comms', 'thread-list-item')
  const handleClick = useCallback(() => onThreadSelected?.(thread), [thread])
  const parsedDate = useMemo(
    () => (thread.last_message?.sent_at ? new Date(thread.last_message.sent_at) : null),
    [thread.last_message?.sent_at],
  )

  return (
    <div className={className()} onClick={handleClick}>
      <div className={className('image')}>
        <AvatarComponent size={24} />
      </div>
      <div className={className('content')}>
        <div className={className('topline')}>
          <span className={className('topic')}>{thread.subject ?? '(no subject)'}</span>
          <span className={className('last-message')}>{parsedDate?.toUTCString()}</span>
        </div>
        <div className={className('preview')}>{thread.last_message?.text}</div>
      </div>
    </div>
  )
}
