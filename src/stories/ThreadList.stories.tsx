import { UserKey } from '@source-health/client'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SourceElements, ThreadList, ThreadListProps } from '..'

export default {
  title: 'Components/ThreadList',
  component: ThreadList,
} as Meta

export const Simple: Story<ThreadListProps> = (args) => (
  <SourceElements
    authentication={
      new UserKey(
        'uk_Fp6Mgqk58VHIOPS9kGg6YWRZsVxIp0VjAWygkuxJO3VdfksyYLpx3C4gjrNrIbgWAC0cLLxQX8wWHj8M5xs4JVBXjDD6ntxc',
        false,
      )
    }
    baseUrl="http://localhost:3000"
  >
    <ThreadList {...args} />
  </SourceElements>
)
