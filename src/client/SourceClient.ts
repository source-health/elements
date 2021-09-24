import { Thread } from '.'

interface ListThreadParams {
  readonly status?: 'closed' | 'awaiting_care_team' | 'awaiting_member'
  readonly starting_after?: string
  readonly ending_before?: string
}

type Page<T> = {
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
