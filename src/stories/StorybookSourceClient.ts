import { Page, SourceClient, Thread } from '../client'

export class StorybookSourceClient extends SourceClient {
  constructor() {
    super('', '')
  }

  public listThreads(): Promise<Page<Thread>> {
    return Promise.resolve({
      data: [
        {
          id: '123',
          subject: 'Test Subject',
          last_message: {
            text: 'This is the preview of the message',
            sent_at: new Date().toISOString(),
          },
        },
      ],
      has_more: true,
    })
  }
}
