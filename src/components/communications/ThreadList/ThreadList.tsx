import React, { ComponentType, FunctionComponent } from 'react'

import { Thread } from '../../../client'
import { usePaginatedList } from '../../../hooks'
import { Callback } from '../../../types'
import { AvatarProps } from '../../Avatar'
import { LoadingProps } from '../../Loading'
import { InfiniteScrollPaginator, InfiniteScrollPaginatorProps } from '../../Paginator'
import { ThreadListContainer, ThreadListContainerProps } from '../ThreadListContainer'
import { ThreadListItem, ThreadListItemProps } from '../ThreadListItem'

interface ThreadListFilters {
  /**
   * Only show threads for the given member
   */
  readonly member?: string

  /**
   * Only show threads in the given status
   */
  readonly status?: 'closed' | 'awaiting_care_team' | 'awaiting_member'
}

export interface ThreadListProps {
  /**
   * Optional list of filters to pass to the thread list API call
   */
  readonly filters?: ThreadListFilters

  /**
   * Callback that will be invoked when a thread is tapped/clicked in the interface
   */
  readonly onThreadSelected?: Callback<Thread>
  /**
   * Component that is responsible for rendering user avatars
   */
  readonly AvatarComponent?: ComponentType<AvatarProps>
  /**
   * Component that is responsible for showing a loading state
   */
  readonly LoadingComponent?: ComponentType<LoadingProps>

  /**
   * Component that is responsible for rendering all of the threads
   */
  readonly ContainerComponent?: ComponentType<ThreadListContainerProps>

  /**
   * Component that is responsible for rendering a single thread in the list
   */
  readonly ItemComponent?: ComponentType<ThreadListItemProps>

  /**
   * Component that is responsible for loading more channels as needed
   */
  readonly PaginatorComponent?: ComponentType<InfiniteScrollPaginatorProps>
}

export const ThreadList: FunctionComponent<ThreadListProps> = ({
  filters,
  onThreadSelected,
  AvatarComponent,
  LoadingComponent,
  PaginatorComponent: Paginator = InfiniteScrollPaginator,
  ContainerComponent: Container = ThreadListContainer,
  ItemComponent: Item = ThreadListItem,
}) => {
  const { data, isLoading, isRefreshing, hasNextPage, fetchNextPage } = usePaginatedList(
    (client, paging) =>
      client.listThreads({
        ...filters,
        ...paging,
        expand: ['assignee', 'last_message.sender'],
      }),
    [filters],
  )

  return (
    <Container loading={isRefreshing} threads={data} LoadingComponent={LoadingComponent}>
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
