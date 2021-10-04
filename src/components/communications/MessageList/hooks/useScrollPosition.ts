import { Message } from '@source-health/client'
import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react'

import { Callback } from '../../../../types'

export interface UseScrollPositionArgs {
  /**
   * Scrollable element
   */
  listRef: RefObject<HTMLElement>

  /**
   * List of messages that are being rendered into the window
   */
  messages: Message[]

  /**
   * Number of pixels from the bottom that will be considered "pinned" to the bottom
   */
  scrollUpThreshold?: number
}

export interface UseScrollPositionArgsResult {
  /**
   * Handler to scroll the window to the bottom
   */
  scrollToBottom: Callback
}

export function useScrollPosition({
  listRef,
  messages,
  scrollUpThreshold = 100,
}: UseScrollPositionArgs): UseScrollPositionArgsResult {
  const isPinnedToBottom = useRef(true)
  const previousMeasures = useRef({
    offsetHeight: 0,
    scrollHeight: 0,
  })

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo?.({
      top: listRef.current.scrollHeight,
    })
  }, [listRef])

  const onScroll = useCallback((event: Event) => {
    const { scrollTop, scrollHeight, offsetHeight } = event.currentTarget as HTMLDivElement
    const pinnedToBottom = scrollHeight - (scrollTop + offsetHeight) < scrollUpThreshold

    isPinnedToBottom.current = pinnedToBottom
  }, [])

  useLayoutEffect(() => {
    listRef.current?.addEventListener('scroll', onScroll)
    return () => listRef.current?.removeEventListener('scroll', onScroll)
  }, [listRef, onScroll])

  useEffect(() => {
    const wasOnBottom = isPinnedToBottom.current
    // const prevMeasures = previousMeasures.current
    const measures = {
      offsetHeight: listRef?.current?.offsetHeight ?? 0,
      scrollHeight: listRef?.current?.scrollHeight ?? 0,
    }

    // const heightDelta = measures.scrollHeight - prevMeasures.scrollHeight

    // See if new messages were added to the list
    if (wasOnBottom) {
      scrollToBottom()
    }

    // Capture the new measures so we can check next time
    previousMeasures.current = measures
  }, [listRef, messages])

  return {
    scrollToBottom,
  }
}
