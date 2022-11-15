import { Source, UserAuthentication } from '@source-health/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { MessageList, MessageListProps, SourceElements, Thread } from '..'
import { MessageInput } from '../components/communications/MessageInput'

export default {
  title: 'Components/Message List',
  component: MessageList,
} as Meta

export const Simple: Story<MessageListProps> = (args) => (
  <SourceElements
    client={
      new Source(
        new UserAuthentication(
          'uk_SUUqS9xxDJPg0EvGnTHz7nRh8MOYqnOdoeYiWn1dYpCAac1o7pgSGTlBwWcQEohyV54yGHo5QQL3vIeGUBhTQrHGLB1BH2fq',
          true,
        ),
        {
          baseUrl: 'http://localhost:3000',
        },
      )
    }
  >
    <Thread id="thrd_LyBsSYXNXfqzMsPObitv">
      <MessageList {...args} />
      <MessageInput />
    </Thread>
  </SourceElements>
)
