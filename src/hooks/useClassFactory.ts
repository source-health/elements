import { useCallback } from 'react'

export function useClassFactory(module: string, component: string): (name?: string) => string {
  return useCallback(
    (name?: string) =>
      name ? `source-${module}__${component}--${name}` : `source-${module}__${component}`,
    [module, component],
  )
}
