import type { Message as MessageResource } from '@source-health/client'
import React, { FunctionComponent } from 'react'

import { useClassFactory } from '../../../hooks'
import { Formatter } from '../../../types'
import { expand } from '../../../utils'
import { Avatar } from '../../Avatar'
import { Name } from '../../Name'

import { Attachment } from './Attachment'

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
  const sender = expand(message.sender)
  const isOutgoing = sender?.id.startsWith('mem_')
  const senderPhoto =
    sender?.object === 'api_key' ? null : sender.profile_image ? expand(sender.profile_image) : null
  const directionClassName = className(isOutgoing ? 'outgoing' : 'incoming')
  const classNamesList = [className(), groupClassName, directionClassName]
  if (message.redacted_at) {
    classNamesList.push(className('redacted'))
  }
  const classNames = classNamesList.join(' ')
  const date = new Date(message.sent_at)

  return (
    <div className={classNames}>
      <div className={className('image')}>
        <Avatar size={32} file={senderPhoto} />
      </div>
      <div className={className('container')}>
        <div className={className('contents')}>
          <div className={className('content')}>{message.text}</div>
          {message.attachments.length > 0 && (
            <div className={`${className('content')} ${className('attachment')}`}>
              {message.attachments.map((attachment, index) => {
                return <Attachment key={index} attachment={attachment} />
              })}
            </div>
          )}
        </div>
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
