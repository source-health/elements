import { render } from '@testing-library/react'
import React from 'react'

import { Message as MessageResource } from '../../../client'

import { Message } from './Message'

describe('Message', () => {
  const message: MessageResource = {
    id: 'msg_123',
    text: 'This is a message',
    thread: 'thr_asdf',
    sender: {
      object: 'user',
      id: 'usr_123',
      first_name: 'Colin',
      last_name: 'Morelli',
    },
    sent_at: new Date().toISOString(),
  }

  it('should render a message', async () => {
    const container = render(<Message message={message} />)

    expect(await container.findByText('Colin Morelli')).not.toBeNull()
    expect(await container.findByText(message.text)).not.toBeNull()
  })
})
