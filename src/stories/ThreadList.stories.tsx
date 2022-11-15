import { Source, UserAuthentication } from '@source-health/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SourceElements, ThreadList, ThreadListProps } from '..'

export default {
  title: 'Components/ThreadList',
  component: ThreadList,
  argTypes: {
    apiKey: { control: 'text' },
  },
} as Meta

export const Simple: Story<ThreadListProps & { apiKey?: string }> = (args) => (
  <SourceElements
    client={
      new Source(new UserAuthentication(args.apiKey ?? '', false), {
        baseUrl: 'http://localhost:3000',
      })
    }
  >
    <ThreadList {...args} />
  </SourceElements>
)
