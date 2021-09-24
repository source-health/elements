import { createElement, FunctionComponent } from 'react'

import { SourceClient } from '../src/client'
import { SourceContext } from '../src/context/elements'

type Mock<T> = T extends (...args: infer P) => infer R
  ? jest.Mock<R, P>
  : {
      [K in keyof T]: Mock<T[K]>
    }

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

export function createDelayedPromise<T>(delay: number, data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}
