import { createDelayedPromise } from '../../test/utils'
import { ListThreadParams, Page, SourceClient, Thread } from '../client'

export class StorybookSourceClient extends SourceClient {
  constructor() {
    super('', '')
  }

  public listThreads(params?: ListThreadParams): Promise<Page<Thread>> {
    const startId = params?.starting_after?.substring(4)
    const parsedStartId = startId ? parseInt(startId, 10) + 1 : 0

    return createDelayedPromise(1000, {
      data: new Array(20).fill(0).map((_, i) => ({
        id: `thr_${parsedStartId + i}`,
        subject: `Thread ${parsedStartId + i} Subject`,
        assignee: '',
        last_message: {
          text: 'This is the preview of the message',
          sender: '',
          sent_at: new Date().toISOString(),
        },
      })),
      has_more: !params?.starting_after,
    })
  }
}
