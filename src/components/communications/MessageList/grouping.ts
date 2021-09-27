import { Message } from '../../../client'

export type IsGroupedCallback = (
  left: Message | null | undefined,
  right: Message | null | undefined,
) => boolean

export function defaultIsGrouped(
  left: Message | null | undefined,
  right: Message | null | undefined,
): boolean {
  if (!left || !right) {
    return false
  }

  const leftTimestamp = new Date(left.sent_at)
  const rightTimestamp = new Date(right.sent_at)

  const isMatchingSender = left.sender?.id === right.sender?.id
  const isCloseDate = Math.abs(rightTimestamp.getTime() - leftTimestamp.getTime()) < 5 * 60 * 1000 // 5 minutes

  return isMatchingSender && isCloseDate
}

export function neverIsGrouped(): boolean {
  return false
}
