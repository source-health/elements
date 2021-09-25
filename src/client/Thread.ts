export interface Thread {
  id: string
  subject: string
  assignee: unknown
  last_message: {
    text: string
    sender: unknown
    sent_at: string
  }
}
