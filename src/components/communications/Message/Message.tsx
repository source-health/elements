import React, { FunctionComponent } from 'react'

import { Message as MessageResource } from '../../../client'
import { useClassFactory } from '../../../hooks'

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
  const isOutgoing = typeof message.sender === 'string' && message.sender.startsWith('mem_')
  const previousClassName = groupWithPrevious ? '-group-prev' : ''
  const nextClassName = groupWithNext ? '-group-next' : ''
  const directionClassName = isOutgoing ? '-outgoing' : '-incoming'
  const classNames = [className(), previousClassName, nextClassName, directionClassName]
    .filter((name) => !!name)
    .join(' ')

  return (
    <div className={classNames}>
      <div className={className('sender')}>Colin Morelli</div>
      <div className={className('content')}>{message.text}</div>
    </div>
  )
}
