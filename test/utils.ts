import type { Member, Source } from '@source-health/client'
import { createElement, FunctionComponent } from 'react'

import { SourceContext } from '../src/context/elements'

type MockableKeys<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R ? jest.Mock<R, P> : MockableTree<T[K]>
}

type MockableTree<T> = Partial<MockableKeys<T>>

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
export function createElementsWrapper<T extends MockableTree<Source>>(
  client: T,
  member: Member | null = null,
): [FunctionComponent<unknown>, T] {
  const wrapper: FunctionComponent<unknown> = ({ children }) =>
    createElement(SourceContext.Provider, {
      value: {
        client: client as any, // eslint-disable-line
        member,
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
