import React, { FunctionComponent, useCallback, useRef } from 'react'

import { useMessageInputContext } from '../../../context/input'
import { useClassFactory, useFocusTracking } from '../../../hooks'
import { AutosizeTextarea } from '../../AutosizeTextarea'

import { SendMessageButton } from './SendMessageButton'

export const MessageInputSimple: FunctionComponent<unknown> = () => {
  const className = useClassFactory('comms', 'message-input')
  const ref = useRef<HTMLTextAreaElement>(null)
  const { text, handleChange, send } = useMessageInputContext()
  const isFocused = useFocusTracking(ref)
  const classNames = [
    className(),
    isFocused ? className('focused') : '',
    text ? className('has-text') : '',
  ].join(' ')
  const handleClick = useCallback(() => send(), [send])

  return (
    <div className={classNames}>
      <AutosizeTextarea
        className={className('textarea')}
        ref={ref}
        onChange={handleChange}
        value={text}
      />
      <div className={className('action-buttons')}>
        <SendMessageButton className={className('send-button')} size={20} onClick={handleClick} />
      </div>
    </div>
  )
}
