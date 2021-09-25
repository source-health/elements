import { Message } from './Message'
import { Thread } from './Thread'

export interface PaginationParams {
  starting_after?: string
  ending_before?: string
  limit?: number
}

export interface ListThreadParams extends PaginationParams {
  status?: 'closed' | 'awaiting_care_team' | 'awaiting_member'
  expand?: string | string[]
}

export interface ListMessageParams extends PaginationParams {
  thread: string
}

export type Page<T> = {
  data: T[]
  has_more: boolean
}

export class SourceClient {
  constructor(protected readonly baseUrl: string, protected readonly token: string) {
    this.baseUrl = baseUrl
    this.token = token
  }

  /**
   *
   */
  public async listMessages(params: ListMessageParams): Promise<Page<Message>> {
    return this.request(this.buildUrl('/v1/communication/messages', params), {})
  }

  /**
   *
   */
  public async listThreads(params: ListThreadParams = {}): Promise<Page<Thread>> {
    return this.request(this.buildUrl('/v1/communication/threads', params), {})
  }

  private buildUrl(url: string, query?: unknown): string {
    const params = query ? new URLSearchParams(query as Record<string, string>) : null
    const formattedParams = params?.toString()
    return this.baseUrl.concat(url).concat(formattedParams ? '?' + formattedParams : '')
  }

  private async request<T>(url: string, config: RequestInit): Promise<T> {
    const response = await fetch(url, {
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${this.token}`,
        'Catalyst-Live-Mode': 'false',
      },
      ...config,
    })

    return await response.json()
  }
}
