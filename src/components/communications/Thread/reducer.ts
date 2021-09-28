import { Message } from '../../../client'

export interface ThreadState {
  threadId: string | null
  isLoading: boolean
  hasMoreMessages: boolean
  messages: Message[]
}

interface InitializeThreadAction {
  type: 'initializeThread'
  id: string
}

interface InitializeThreadSuccessAction {
  type: 'initializeThreadSuccess'
  messages: Message[]
  hasMore: boolean
}

interface LoadMoreMessagesAction {
  type: 'loadMoreMessages'
}

interface LoadMoreMessagesSuccessAction {
  type: 'loadMoreMessagesSuccess'
  messages: Message[]
  hasMore: boolean
}

interface SendMessageAction {
  type: 'sendMessage'
  message: Message
}

interface SendMessageSuccessAction {
  type: 'sendMessageSuccess'
  temporaryMessage: Message
  message: Message
}

interface SendMessageFailureAction {
  type: 'sendMessageFailure'
  temporaryMessage: Message
}

export type ThreadActions =
  | InitializeThreadAction
  | InitializeThreadSuccessAction
  | LoadMoreMessagesAction
  | LoadMoreMessagesSuccessAction
  | SendMessageAction
  | SendMessageSuccessAction
  | SendMessageFailureAction

export function threadReducer(state: ThreadState, action: ThreadActions): ThreadState {
  switch (action.type) {
    case 'initializeThread':
      return {
        ...state,
        isLoading: true,
        threadId: action.id,
      }
    case 'initializeThreadSuccess':
      return {
        ...state,
        isLoading: false,
        messages: action.messages,
        hasMoreMessages: action.hasMore,
      }
    case 'loadMoreMessages':
      return {
        ...state,
        isLoading: true,
      }
    case 'loadMoreMessagesSuccess':
      return {
        ...state,
        isLoading: false,
        messages: [...action.messages, ...state.messages],
        hasMoreMessages: action.hasMore,
      }
    case 'sendMessage':
      return {
        ...state,
        messages: [...state.messages, action.message],
      }
    case 'sendMessageSuccess':
      return {
        ...state,
        messages: [
          ...state.messages.filter((temp) => temp.id !== action.temporaryMessage.id),
          action.message,
        ],
      }
    case 'sendMessageFailure':
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id !== action.temporaryMessage.id
            ? message
            : {
                ...message,
              },
        ),
      }
  }
}

export const threadInitialState: ThreadState = {
  threadId: null,
  isLoading: false,
  hasMoreMessages: false,
  messages: [],
}
