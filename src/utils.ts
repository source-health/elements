export function expand<T>(input: T | string): T {
  if (typeof input === 'string') {
    throw new Error('Expected resource to be expanded')
  }

  return input
}
