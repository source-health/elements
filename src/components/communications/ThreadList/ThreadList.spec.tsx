import { render, waitForElementToBeRemoved } from '@testing-library/react'
import React from 'react'

import { createDelayedPromise, createElementsWrapper } from '../../../../test/utils'
import { Thread } from '../../../client'

import { ThreadList } from './ThreadList'

describe('ThreadList', () => {
  const [wrapper, client] = createElementsWrapper()

  beforeEach(() => {
    client.listThreads.mockClear()
  })

  it('should show loader while loading', async () => {
    jest.useFakeTimers()
    client.listThreads.mockReturnValue(
      createDelayedPromise(10, {
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
    client.listThreads.mockReturnValue(Promise.reject(new Error('Unable to load')))

    const container = render(<ThreadList />, {
      wrapper,
    })

    // Make sure the loading indicator shows
    expect(await container.findByText('Error: Unable to load')).not.toBeNull()
  })

  it('should render all returned threads', async () => {
    const thread1: Thread = {
      id: '123',
      subject: 'Subject: First Thread',
      assignee: null,
      last_message: {
        sent_at: '',
        sender: null,
        text: 'Preview: This is a test of thread 123',
      },
    }

    const thread2: Thread = {
      id: '456',
      subject: 'Subject: Second Thread',
      assignee: null,
      last_message: {
        sent_at: '',
        sender: null,
        text: 'Preview: This is a test of thread 456',
      },
    }

    client.listThreads.mockReturnValue(
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
