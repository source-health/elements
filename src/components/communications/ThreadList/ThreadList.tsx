import type { Thread, ThreadStatus } from '@source-health/client'
import React, { ComponentType, FunctionComponent } from 'react'

import { usePaginatedList } from '../../../hooks'
import { Callback } from '../../../types'
import { AvatarProps } from '../../Avatar'
import { LoadingErrorProps, LoadingProps } from '../../Loading'
import { InfiniteScrollPaginator, InfiniteScrollPaginatorProps } from '../../Paginator'
import { ThreadListContainer, ThreadListContainerProps } from '../ThreadListContainer'
import { ThreadListItem, ThreadListItemProps } from '../ThreadListItem'

interface ThreadListFilters {
  /**
   * Only show threads for the given member
   */
  member?: string

  /**
   * Only show threads in the given status
   */
  status?: ThreadStatus[]
}

export interface ThreadListProps {
  /**
   * Optional list of filters to pass to the thread list API call
   */
  filters?: ThreadListFilters

  /**
   * Callback that will be invoked when a thread is tapped/clicked in the interface
   */
  onThreadSelected?: Callback<Thread>

  /**
   * Component that is responsible for rendering user avatars
   */
  AvatarComponent?: ComponentType<AvatarProps>

  /**
   * Component that is responsible for showing a loading state
   */
  LoadingComponent?: ComponentType<LoadingProps>

  /**
   * Component that is responsible for showing a a looading error
   */
  LoadingErrorComponent?: ComponentType<LoadingErrorProps>

  /**
   * Component that is responsible for rendering all of the threads
   */
  ContainerComponent?: ComponentType<ThreadListContainerProps>

  /**
   * Component that is responsible for rendering a single thread in the list
   */
  ItemComponent?: ComponentType<ThreadListItemProps>

  /**
   * Component that is responsible for loading more channels as needed
   */
  PaginatorComponent?: ComponentType<InfiniteScrollPaginatorProps>
}

export const ThreadList: FunctionComponent<ThreadListProps> = ({
  filters,
  onThreadSelected,
  AvatarComponent,
  LoadingComponent,
  LoadingErrorComponent,
  PaginatorComponent: Paginator = InfiniteScrollPaginator,
  ContainerComponent: Container = ThreadListContainer,
  ItemComponent: Item = ThreadListItem,
}) => {
  const { data, error, isLoading, isRefreshing, hasNextPage, fetchNextPage } = usePaginatedList(
    {
      fetch: (client, paging) =>
        client.communications.threads.list(
          {
            ...filters,
            ...paging,
          },
          {
            expand: [
              'data.assignee',
              'data.last_message.sender',
              'data.last_message.sender.profile_image',
            ],
          },
        ),
    },
    [filters],
  )

  return (
    <Container
      loading={isRefreshing}
      error={error}
      threads={data}
      LoadingComponent={LoadingComponent}
      LoadingErrorComponent={LoadingErrorComponent}
    >
      <Paginator
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        LoadingComponent={LoadingComponent}
      >
        {data.map((thread) => (
          <Item
            key={thread.id}
            thread={thread}
            onThreadSelected={onThreadSelected}
            AvatarComponent={AvatarComponent}
          />
        ))}
      </Paginator>
    </Container>
  )
}
