import React, { FunctionComponent } from 'react'

import { Message as MessageResource } from '../../../client'
import { useClassFactory } from '../../../hooks'
import { Formatter } from '../../../types'
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

  /**
   * Custom function to format a date into a string
   */
  formatTimestamp?: Formatter<Date, string>
}

const defaultDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'short',
})

export const Message: FunctionComponent<MessageProps> = ({
  formatTimestamp = (date) => defaultDateFormatter.format(date),
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
  const date = new Date(message.sent_at)

  return (
    <div className={classNames}>
      {/* <div className={className('image')}>
        <Avatar size={32} />
      </div> */}
      <div className={className('container')}>
        <div className={className('content')}>{message.text}</div>
        <div className={className('meta')}>
          <div className={className('sender')}>
            <Name person={message.sender} />
          </div>
          <div className={className('timestamp')}>{formatTimestamp(date)}</div>
        </div>
      </div>
    </div>
  )
}
