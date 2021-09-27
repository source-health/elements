import { createDelayedPromise } from '../../test/utils'
import { ListMessageParams, ListThreadParams, Page, SourceClient, Thread, Message } from '../client'

export class StorybookSourceClient extends SourceClient {
  constructor() {
    super('', '')
  }

  public async listMessages(params: ListMessageParams): Promise<Page<Message>> {
    console.log('loading more messages', params)
    const startId = params?.starting_after?.substring(4)
    const parsedStartId = startId ? parseInt(startId, 10) + 1 : 0

    return createDelayedPromise(1000, {
      data: new Array(20).fill(0).map((_, i) => ({
        id: `msg_${parsedStartId + i}`,
        text: 'Hello, this is a message',
        thread: params.thread,
        sender: null,
        sent_at: new Date().toISOString(),
      })),
      has_more: !params?.starting_after,
    })
  }

  public listThreads(params?: ListThreadParams): Promise<Page<Thread>> {
    const startId = params?.starting_after?.substring(4)
    const parsedStartId = startId ? parseInt(startId, 10) + 1 : 0

    return createDelayedPromise(1000, {
      data: new Array(20).fill(0).map((_, i) => ({
        id: `thr_${parsedStartId + i}`,
        subject: `Thread ${parsedStartId + i} Subject`,
        assignee: null,
        last_message: {
          text: 'This is the preview of the message',
          sender: null,
          sent_at: new Date().toISOString(),
        },
      })),
      has_more: !params?.starting_after,
    })
  }
}
