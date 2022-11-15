import type {
  Expandable,
  Member,
  Message as MessageResource,
  Thread,
  User,
} from '@source-health/client'
import { render } from '@testing-library/react'
import React from 'react'

import { Message } from './Message'

describe('Message', () => {
  const message: MessageResource = {
    object: 'message',
    id: 'msg_123',
    text: 'This is a message',
    thread: 'thr_asdf' as Expandable<Thread>,
    type: 'text',
    channel_type: 'chat',
    channel: null,
    from: null,
    to: null,
    direction: 'inbound',
    status: 'sent',
    sender: {
      object: 'user',
      id: 'usr_123',
      first_name: 'Colin',
      last_name: 'Morelli',
    } as User,
    impersonated_by: null,
    attachments: [],
    sent_at: new Date().toISOString(),
    redacted_at: null,
  }

  const outgoingMessage: MessageResource = {
    object: 'message',
    id: 'msg_123',
    text: 'This is a message',
    thread: 'thr_asdf' as Expandable<Thread>,
    type: 'text',
    channel_type: 'chat',
    channel: null,
    from: null,
    to: null,
    direction: 'inbound',
    status: 'sent',
    sender: {
      object: 'member',
      id: 'mem_123',
      first_name: 'Colin',
      last_name: 'Morelli',
    } as Member,
    impersonated_by: null,
    attachments: [],
    sent_at: new Date().toISOString(),
    redacted_at: null,
  }

  it('should render a message', async () => {
    const container = render(<Message message={message} />)

    expect(await container.findByText('Colin Morelli')).not.toBeNull()
    expect(await container.findByText(message.text)).not.toBeNull()
  })

  it('should apply grouping class names', async () => {
    const { container } = render(<Message message={message} groupWithPrevious groupWithNext />)
    const element = container.firstElementChild

    expect(element).toHaveClass('source-comms__message--middle')

    const { container: container2 } = render(<Message message={message} />)
    const element2 = container2.firstElementChild

    expect(element2).toHaveClass('source-comms__message--single')
  })

  it('should apply direction class name', async () => {
    const { container } = render(<Message message={message} groupWithPrevious groupWithNext />)
    const element = container.firstElementChild

    expect(element).toHaveClass('source-comms__message--incoming')

    const { container: container2 } = render(<Message message={outgoingMessage} />)
    const element2 = container2.firstElementChild

    expect(element2).toHaveClass('source-comms__message--outgoing')
  })

  it('should render message attachments', async () => {
    const message: MessageResource = {
      object: 'message',
      id: 'msg_123',
      text: 'This is a message',
      thread: 'thr_asdf' as Expandable<Thread>,
      type: 'text',
      channel_type: 'chat',
      channel: null,
      from: null,
      to: null,
      direction: 'inbound',
      status: 'sent',
      sender: {
        object: 'user',
        id: 'usr_123',
        first_name: 'Colin',
        last_name: 'Morelli',
      } as User,
      impersonated_by: null,
      attachments: [
        {
          type: 'file',
          resource: {
            object: 'file',
            id: 'fil_128',
            name: 'Test File.pdf',
            mime_type: 'application/pdf',
            size: 1203,
            purpose: 'message_attachment',
            url: 'https://example.org/test-file',
            url_expires_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            variants: {},
          },
          description: 'Test File.pdf',
          url: 'https://example.org/test-file',
          metadata: {},
        },
      ],
      sent_at: new Date().toISOString(),
      redacted_at: null,
    }

    const { container, getByText } = render(<Message message={message} />)
    const element = container.firstElementChild

    expect(element).toHaveClass('source-comms__message--incoming')

    const attachmentLink = getByText('Test File.pdf')
    expect(attachmentLink.getAttribute('href')).toEqual('https://example.org/test-file')
    expect(attachmentLink.hasAttribute('download')).toBeTruthy()
    expect(attachmentLink).toHaveClass('source-comms__message-attachment--link')
  })
})
