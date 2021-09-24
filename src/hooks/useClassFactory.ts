import { useCallback } from 'react'

/**
 * Creates a hook-compliant function for generating patterned class names
 *
 * @param module the module that the component belongs to
 * @param component the name of the module
 * @returns a function that can be passed another string to generate a sub-tree classname
 */
export function useClassFactory(module: string, component: string): (name?: string) => string {
  return useCallback(
    (name?: string) =>
      name ? `source-${module}__${component}--${name}` : `source-${module}__${component}`,
    [module, component],
  )
}
