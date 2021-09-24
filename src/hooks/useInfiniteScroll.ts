import { RefCallback, useEffect, useState } from 'react'

/**
 * Because of the way React state changes work, there will typically be a brief period
 * (a single frame) between when the loading variable passed into the hook below will be
 * `false`, and the actual new content renders. This means the sentinel element will be
 * "visible" which would then trigger another load.
 *
 * Forcing a small delay here allows us to skip past that
 */
const DEFAULT_DELAY_IN_MS = 25

export interface UseInfiniteScrollHookArgs {
  /**
   * Indicates to the component that more content is currently loading, which temporarily
   * disables the infinite scroll
   */
  loading: boolean
  /**
   * Set to true to indicate there is more data to be fetched. If false, the `onLoadMore`
   * will not be called.
   */
  hasNextPage: boolean
  /**
   * Function that will be invoked when more content should be loaded. This method is
   * called {delayInMs}ms after the sentinel element triggers the intersection observer.
   */
  onLoadMore: VoidFunction
  /**
   * Set to `true` to disable infinite scrolling for any reason
   */
  disabled?: boolean
  /**
   * Delay between the intersection observer firing and calling onLoadMore
   */
  delayInMs?: number
  /**
   * Root margin to apply to the IntersectionObserver. You can see more about what this
   * property does here:
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
   */
  rootMargin?: string
}

export function useInfiniteScroll({
  loading,
  hasNextPage,
  onLoadMore,
  rootMargin,
  disabled,
  delayInMs = DEFAULT_DELAY_IN_MS,
}: UseInfiniteScrollHookArgs): [RefCallback<HTMLElement>, RefCallback<HTMLElement>] {
  const [nodeRef, setNodeRef] = useState<HTMLElement | null>(null)
  const [rootRef, setRootRef] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const shouldLoadMore = !disabled && !loading && isVisible && hasNextPage

  useEffect(() => {
    if (!nodeRef) {
      return
    }

    const observer = new IntersectionObserver(
      (evt) => {
        setIsVisible(evt.some((item) => item.isIntersecting))
      },
      {
        root: rootRef,
        rootMargin,
      },
    )

    observer.observe(nodeRef)

    return () => observer.disconnect()
  }, [rootRef, nodeRef, rootMargin])

  useEffect(() => {
    if (!shouldLoadMore) {
      return
    }

    const interval = setTimeout(() => {
      onLoadMore()
    }, delayInMs)

    return () => clearInterval(interval)
  }, [shouldLoadMore])

  return [setNodeRef, setRootRef]
}
