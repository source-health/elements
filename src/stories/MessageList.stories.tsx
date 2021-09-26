import { Meta, Story } from '@storybook/react'
import React from 'react'

import { MessageList, MessageListProps, SourceElements, Thread } from '..'

export default {
  title: 'Components/Message List',
  component: MessageList,
} as Meta

export const Simple: Story<MessageListProps> = (args) => (
  <SourceElements
    token="uk_VqieADzrz9aiq9T7zKisU9cvWb3iA1ceIjLLGAi85Ku9JJlxvT7oai78Ci7qNwmQSuECQ2rp5i6JWpeIOE36ZSY6ENU6Kdcj"
    baseUrl="http://localhost:3000"
  >
    <Thread id="thrd_PJAcMMhZwhzz6z12A4c2">
      <MessageList {...args} />
    </Thread>
  </SourceElements>
)
