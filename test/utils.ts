import { createElement, FunctionComponent } from 'react'

import { SourceClient } from '../src/client'
import { SourceContext } from '../src/context/elements'

type Mock<T> = T extends (...args: infer P) => infer R
  ? jest.Mock<R, P>
  : {
      [K in keyof T]: Mock<T[K]>
    }

/**
 * Creates a wrapper component and a mock SourceClient instance to test individual Elements
 *
 * Normally, when using the SDK, we expect users to mount <SourceElements> at the root of their
 * application. This component will set up an API client and make it available to downstream
 * components.
 *
 * When testing, however, we don't want to make real API calls (at least not for most tests). So
 * instead, we can call this method which will generate a replacement SourceElements wrapper which
 * creates a mock API client, and passes that down to child components.
 *
 * @returns the wrapper element to render and the mock
 */
export function createElementsWrapper(): [FunctionComponent<unknown>, Mock<SourceClient>] {
  const client: Mock<SourceClient> = {
    listThreads: jest.fn(),
  }

  const wrapper: FunctionComponent<unknown> = ({ children }) =>
    createElement(SourceContext.Provider, {
      value: {
        client: client as any, // eslint-disable-line
      },
      children,
    })

  return [wrapper, client]
}

/**
 * Simple shorthand for creating a promise that resolves after a delay
 *
 * This is helpful for testing the loading states of individual components when mocking out
 * API responses.
 *
 * @param delay Delay time for promsie resolution (in ms)
 * @param data Data that should be provided after the delay
 * @returns a promise that will be resolved after {delay}ms
 */
export function createDelayedPromise<T>(delay: number, data: T | Error): Promise<T> {
  return new Promise((resolve, reject) => {
    if (data instanceof Error) {
      setTimeout(() => reject(data), delay)
    } else {
      setTimeout(() => resolve(data), delay)
    }
  })
}
