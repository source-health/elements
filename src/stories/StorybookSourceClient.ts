import { createDelayedPromise } from '../../test/utils'
import { ListThreadParams, Page, SourceClient, Thread } from '../client'

export class StorybookSourceClient extends SourceClient {
  constructor() {
    super('', '')
  }

  public listThreads(params?: ListThreadParams): Promise<Page<Thread>> {
    return createDelayedPromise(2500, {
      data: new Array(20).fill(0).map((_, i) => ({
        id: `thr_${params?.starting_after ?? ''}-${i}`,
        subject: 'Test Subject' + i,
        last_message: {
          text: 'This is the preview of the message',
          sent_at: new Date().toISOString(),
        },
      })),
      has_more: true,
    })
  }
}
