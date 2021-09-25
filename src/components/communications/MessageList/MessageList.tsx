import React, { ComponentType, FunctionComponent, useRef } from 'react'

import { useThreadContext } from '../../../context/thread'
import { usePaginatedList } from '../../../hooks'
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
   *
   */
  PaginatorComponent?: ComponentType<InfiniteScrollPaginatorProps>

  /**
   *
   */
  LoadingComponent?: ComponentType<LoadingProps>

  /**
   *
   */
  LoadingErrorComponent?: ComponentType<LoadingErrorProps>
}

export const MessageList: FunctionComponent<MessageListProps> = ({
  shouldGroupMessages,
  LoadingComponent,
  PaginatorComponent: Paginator = InfiniteScrollPaginator,
}) => {
  const listRef = useRef<HTMLDivElement>(null)
  const { id } = useThreadContext()
  const { data, isLoading, hasNextPage, fetchNextPage } = usePaginatedList(
    {
      fetch: (client, paging) =>
        client.listMessages({
          thread: id,
          ...paging,
        }),
      isReversed: true,
    },
    [id],
  )

  const groupingFunction =
    typeof shouldGroupMessages === 'undefined'
      ? defaultIsGrouped
      : shouldGroupMessages
      ? defaultIsGrouped
      : neverIsGrouped

  useScrollPosition({
    messages: data,
    listRef,
  })

  return (
    <div>
      <Paginator
        isLoading={isLoading}
        isReversed={true}
        hasNextPage={hasNextPage}
        scrollableRef={listRef}
        fetchNextPage={fetchNextPage}
        LoadingComponent={LoadingComponent}
      >
        {data.map((message, i) => (
          <Message
            key={message.id}
            message={message}
            groupWithPrevious={groupingFunction(data[i - 1], message)}
            groupWithNext={groupingFunction(message, data[i + 1])}
          />
        ))}
      </Paginator>
    </div>
  )
}
