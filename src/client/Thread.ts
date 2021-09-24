export interface Thread {
  id: string
  subject: string
  last_message: {
    text: string
    sent_at: string
  }
}
