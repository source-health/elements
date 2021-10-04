import { UserKey } from '@source-health/client'
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
    authentication={
      new UserKey(
        'uk_0eWy5mTpsSpnRAp1oIJEXnJHZlG7IoSk5L3LoRa7sS1MdChHzZfxHfeOUwGntyVsvoErB65xF7moaIJuL6KY7ygtJdSJa5IZ',
        false,
      )
    }
    baseUrl="http://localhost:3000"
  >
    <Thread id="thrd_PJAcMMhZwhzz6z12A4c2">
      <MessageList {...args} />
      <MessageInput />
    </Thread>
  </SourceElements>
)
