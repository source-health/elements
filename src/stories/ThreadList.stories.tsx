import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ThreadList, ThreadListProps } from '..'
import { SourceContext } from '../context/elements'

import { StorybookSourceClient } from './StorybookSourceClient'

export default {
  title: 'Components/ThreadList',
  component: ThreadList,
} as Meta

export const Simple: Story<ThreadListProps> = (args) => (
  <SourceContext.Provider value={{ client: new StorybookSourceClient() }}>
    <ThreadList {...args} />
  </SourceContext.Provider>
)
