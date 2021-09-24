import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SourceElements, ThreadList, ThreadListProps } from '..'

export default {
  title: 'Components/ThreadList',
  component: ThreadList,
} as Meta

export const Simple: Story<ThreadListProps> = (args) => (
  <SourceElements token="uk_VqieADzrz9aiq9T7zKisU9cvWb3iA1ceIjLLGAi85Ku9JJlxvT7oai78Ci7qNwmQSuECQ2rp5i6JWpeIOE36ZSY6ENU6Kdcj">
    <ThreadList {...args} />
  </SourceElements>
)
