import { Source, UserAuthentication } from '@source-health/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { MessageList, MessageListProps, SourceElements, Thread } from '..'
import { MessageInput } from '../components/communications/MessageInput'

export default {
  title: 'Components/Message List',
  component: MessageList,
  argTypes: {
    apiKey: { control: 'text' },
  },
} as Meta

export const Simple: Story<MessageListProps & { apiKey?: string }> = (args) => (
  <SourceElements
    client={
      new Source(new UserAuthentication(args.apiKey ?? '', true), {
        baseUrl: 'http://localhost:3000',
      })
    }
  >
    <Thread id="thrd_LyBsSYXNXfqzMsPObitv">
      <MessageList {...args} />
      <MessageInput />
    </Thread>
  </SourceElements>
)
