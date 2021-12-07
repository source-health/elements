import { Expandable, Resource } from '@source-health/client'

export function expand<T extends Resource>(input: Expandable<T>): T {
  if (typeof input === 'string') {
    throw new Error('Expected resource to be expanded')
  }

  return input
}
