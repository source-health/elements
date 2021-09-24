import { RefCallback, RefObject, useCallback, useEffect, useState } from 'react'

import { Callback } from '../types/callback'

const DEFAULT_DELAY_IN_MS = 0

export interface UseInfiniteScrollHookArgs {
  // Some sort of "is fetching" info of the request.
  loading: boolean
  // If the list has more items to load.
  hasNextPage: boolean
  // The callback function to execute when the 'onLoadMore' is triggered.
  // eslint-disable-next-line no-undef
  onLoadMore: VoidFunction
  // Flag to stop infinite scrolling. Can be used in case of an error etc too.
  disabled?: boolean
  // How long it should wait before triggering 'onLoadMore'.
  delayInMs?: number
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

  console.log('Visibility', isVisible)

  // Set an intersection observer on the target ref
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

  return [setNodeRef, setRootRef]
}
