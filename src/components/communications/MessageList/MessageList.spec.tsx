import { render } from '@testing-library/react'
import React, { FC, FunctionComponent } from 'react'

import { createElementsWrapper } from '../../../../test/utils'
import { MessageProps } from '../Message/Message'
import { Thread, ThreadProps } from '../Thread'

import { MessageList } from './MessageList'

describe('MessageList', () => {
  const [wrapper, client] = createElementsWrapper({
    communications: {
      messages: {
        list: jest.fn(),
        create: jest.fn(),
      },
    },
  })

  const ThreadWrapper: FunctionComponent<ThreadProps> = (props) =>
    wrapper({
      children: <Thread {...props} />,
    })

  it('should use custom message list component', async () => {
    const message = {
      object: 'message' as const,
      id: 'msg1',
      type: 'text' as const,
      thread: 'threadTest',
      text: 'Hello!',
      sender: '',
      sent_at: new Date().toISOString(),
    }

    const customMessageComponent: FC<MessageProps> = ({ message }) => (
      <div data-testid={`custom-msg-${message.id}`}>{message.text}</div>
    )

    client.communications.messages.list.mockReturnValue(
      Promise.resolve({
        object: 'list',
        data: [message],
        has_more: false,
      }),
    )

    const container = render(
      <ThreadWrapper id="threadtest">
        <MessageList MessageComponent={customMessageComponent} />
      </ThreadWrapper>,
    )

    expect(await container.findByTestId('custom-msg-msg1')).toHaveTextContent('Hello!')
  })
})
