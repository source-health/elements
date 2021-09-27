import { Person } from './Person'

export interface Thread {
  id: string
  subject: string
  assignee: Person | null
  last_message: {
    text: string
    sender: Person | null
    sent_at: string
  }
}
