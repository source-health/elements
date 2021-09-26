import React, { FunctionComponent } from 'react'

import { Message as MessageResource } from '../../../client'
import { useClassFactory } from '../../../hooks'
import { Avatar } from '../../Avatar'
import { Name } from '../../Name'

export interface MessageProps {
  /**
   * Message that should be rendered in this component
   */
  message: MessageResource

  /**
   * Whether or not this message is grouped with the previous message
   */
  groupWithPrevious?: boolean

  /**
   * Whether or not this message is grouped with the next message
   */
  groupWithNext?: boolean
}

export const Message: FunctionComponent<MessageProps> = ({
  groupWithPrevious,
  groupWithNext,
  message,
}) => {
  const className = useClassFactory('comms', 'message')
  const groupClassName =
    groupWithNext && groupWithPrevious
      ? className('middle')
      : groupWithNext
      ? className('top')
      : groupWithPrevious
      ? className('bottom')
      : className('single')
  const isOutgoing = message.sender?.id?.startsWith('mem_')
  const directionClassName = className(isOutgoing ? 'outgoing' : 'incoming')
  const classNames = [className(), groupClassName, directionClassName].join(' ')

  return (
    <div className={classNames}>
      <div className={className('image')}>
        <Avatar size={32} />
      </div>
      <div className={className('container')}>
        <div className={className('content')}>{message.text}</div>
        <div className={className('sender')}>
          <Name person={message.sender} />
        </div>
      </div>
    </div>
  )
}
