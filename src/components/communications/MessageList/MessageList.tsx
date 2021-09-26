import React, { ComponentType, FunctionComponent, useRef } from 'react'

import { useThreadContext } from '../../../context/thread'
import { LoadingErrorProps, LoadingProps } from '../../Loading'
import { InfiniteScrollPaginator, InfiniteScrollPaginatorProps } from '../../Paginator'
import { Message } from '../Message'

import { defaultIsGrouped, IsGroupedCallback, neverIsGrouped } from './grouping'
import { useScrollPosition } from './hooks/useScrollPosition'

export interface MessageListProps {
  /**
   * Controls whether or not message grouping is enabled. Can be set to one of:
   *
   * - false, indicating messages should not be grouped
   * - true, indicating messages should be grouped using standard behavior (default)
   * - function, overriding how messages are grouped
   */
  shouldGroupMessages?: boolean | IsGroupedCallback

  /**
   * Custom component to use for the paginator (defaults to infinite scroll)
   */
  PaginatorComponent?: ComponentType<InfiniteScrollPaginatorProps>

  /**
   * Custom component to use for the loading indicator
   */
  LoadingComponent?: ComponentType<LoadingProps>

  /**
   * Custom component to use for the error message
   */
  LoadingErrorComponent?: ComponentType<LoadingErrorProps>
}

export const MessageList: FunctionComponent<MessageListProps> = ({
  shouldGroupMessages,
  LoadingComponent,
  PaginatorComponent: Paginator = InfiniteScrollPaginator,
}) => {
  const listRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, hasMoreMessages, fetchMoreMessages } = useThreadContext()

  const groupingFunction =
    typeof shouldGroupMessages === 'undefined'
      ? defaultIsGrouped
      : shouldGroupMessages
      ? defaultIsGrouped
      : neverIsGrouped

  useScrollPosition({
    messages,
    listRef,
  })

  return (
    <div>
      <Paginator
        isLoading={isLoading}
        isReversed={true}
        hasNextPage={hasMoreMessages}
        scrollableRef={listRef}
        fetchNextPage={fetchMoreMessages}
        LoadingComponent={LoadingComponent}
      >
        {messages.map((message, i) => (
          <Message
            key={message.id}
            message={message}
            groupWithPrevious={groupingFunction(messages[i - 1], message)}
            groupWithNext={groupingFunction(message, messages[i + 1])}
          />
        ))}
      </Paginator>
    </div>
  )
}
