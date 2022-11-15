import type { Expandable, Member, Thread } from '@source-health/client'
import { render, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'

import { createDelayedPromise, createElementsWrapper } from '../../../../test/utils'

import { ThreadList } from './ThreadList'

describe('ThreadList', () => {
  const [wrapper, client] = createElementsWrapper({
    communications: {
      threads: {
        list: jest.fn(),
      },
    },
  })

  beforeEach(() => {
    client.communications.threads.list.mockClear()
  })

  it('should show loader while loading', async () => {
    jest.useFakeTimers()
    client.communications.threads.list.mockReturnValue(
      createDelayedPromise(10, {
        object: 'list',
        data: [],
        has_more: false,
      }),
    )

    const container = render(<ThreadList />, {
      wrapper,
    })

    // Make sure the loading indicator shows
    const loadingElement = await container.findByTestId('loading-indicator')

    // Advance the timer to the promise completion
    jest.advanceTimersByTime(50)

    // Make sure the loader is gone after advancing the timer
    await waitForElementToBeRemoved(loadingElement)
  })

  it('should show an error message when failing', async () => {
    jest.useFakeTimers()
    client.communications.threads.list.mockReturnValue(Promise.reject(new Error('Unable to load')))

    const container = render(<ThreadList />, {
      wrapper,
    })

    // Make sure the loading indicator shows
    expect(await container.findByText('Error: Unable to load')).not.toBeNull()
  })

  it('should render all returned threads', async () => {
    const thread1: Thread = {
      object: 'thread',
      id: '123',
      subject: 'Subject: First Thread',
      assignee: null,
      member: '' as Expandable<Member>,
      status: 'closed',
      channel: null,
      channel_type: 'chat',
      last_remote_contact_point: null,
      last_message: {
        sent_at: '',
        sender: {
          object: 'member',
          id: 'mem_123',
        } as Member,
        text: 'Preview: This is a test of thread 123',
        attachments: [],
        redacted_at: null,
        channel: null,
        channel_type: 'chat',
        direction: 'outbound',
        from: null,
        to: null,
        status: 'sent',
      },
      member_last_read: null,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: null,
    }

    const thread2: Thread = {
      object: 'thread',
      id: '456',
      subject: 'Subject: Second Thread',
      assignee: null,
      member: '' as Expandable<Member>,
      status: 'closed',
      channel: null,
      channel_type: 'chat',
      last_remote_contact_point: null,
      last_message: {
        sent_at: '',
        sender: {
          object: 'member',
          id: 'mem_123',
        } as Member,
        text: 'Preview: This is a test of thread 456',
        attachments: [],
        redacted_at: null,
        channel: null,
        channel_type: 'chat',
        direction: 'outbound',
        from: null,
        to: null,
        status: 'sent',
      },
      member_last_read: null,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: null,
    }

    client.communications.threads.list.mockReturnValue(
      Promise.resolve({
        data: [thread1, thread2],
        has_more: false,
      }),
    )

    const handleSelectThread = jest.fn()
    const container = render(<ThreadList onThreadSelected={handleSelectThread} />, {
      wrapper,
    })

    // Make sure the interface rendered with the data we want
    const subjectElement = await container.findByText('Subject: First Thread')
    const previewElement = await container.findByText('Preview: This is a test of thread 123')

    expect(subjectElement).not.toBeNull()
    expect(previewElement).not.toBeNull()

    // Clicking on the subject should call the handleSelectThread callback
    subjectElement.click()
    expect(handleSelectThread).toHaveBeenCalledWith(thread1)
  })
})
