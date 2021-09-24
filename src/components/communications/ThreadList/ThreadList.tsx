import React, { ComponentType, FunctionComponent } from 'react'

import { Thread } from '../../../client'
import { usePaginatedList } from '../../../hooks'
import { Callback } from '../../../types'
import { AvatarProps } from '../../Avatar'
import { LoadingProps } from '../../Loading'
import { InfiniteScrollPaginator } from '../../Paginator'
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
}

export const ThreadList: FunctionComponent<ThreadListProps> = ({
  filters,
  onThreadSelected,
  AvatarComponent,
  LoadingComponent,
  ContainerComponent: Container = ThreadListContainer,
  ItemComponent: Item = ThreadListItem,
}) => {
  const { data, isLoading, isRefreshing, hasNextPage, fetchNextPage } = usePaginatedList(
    (client, params) =>
      client.listThreads({
        ...filters,
        ...params,
      }),
    [filters],
  )

  return (
    <Container loading={isRefreshing} threads={data} LoadingComponent={LoadingComponent}>
      <InfiniteScrollPaginator
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      >
        {data.map((thread) => (
          <Item
            key={thread.id}
            thread={thread}
            onThreadSelected={onThreadSelected}
            AvatarComponent={AvatarComponent}
          />
        ))}
      </InfiniteScrollPaginator>
    </Container>
  )
}
