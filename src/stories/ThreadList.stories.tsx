import { ApiKey } from '@source-health/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SourceElements, ThreadList, ThreadListProps } from '..'

export default {
  title: 'Components/ThreadList',
  component: ThreadList,
} as Meta

export const Simple: Story<ThreadListProps> = (args) => (
  <SourceElements authentication={new ApiKey('', '')}>
    <ThreadList {...args} />
  </SourceElements>
)
