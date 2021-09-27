import { Person } from './Person'

export interface Message {
  id: string
  text: string
  thread: string
  sender: Person | null
  sent_at: string
}
