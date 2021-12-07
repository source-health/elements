import type { MessageAttachment } from '@source-health/client'
import React, { FunctionComponent } from 'react'

import { useClassFactory } from '../../../../hooks'
import { expand } from '../../../../utils'

export interface AttachmentProps {
  /**
   * Message attachment to render int his component
   */
  attachment: MessageAttachment
}

export const Attachment: FunctionComponent<AttachmentProps> = ({ attachment }) => {
  const className = useClassFactory('comms', 'message-attachment')
  const file = expand(attachment.resource)

  return (
    <div className={className()}>
      <svg
        className={className('icon')}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.0413 9.95931L10.9446 14.8835C9.34633 16.4276 6.755 16.4276 5.15672 14.8835C3.55257 13.3336 3.55932 10.8189 5.17177 9.27709L6.96607 7.56145M6.96607 7.56145L7.37626 7.16923M6.96607 7.56145L9.87531 4.75066C10.9689 3.69412 12.7419 3.69411 13.8354 4.75064C14.933 5.81105 14.9284 7.53168 13.8251 8.58656L11.127 11.1663M6.96607 7.56145L6.61835 7.8974M11.127 11.1663L11.4324 10.8712M11.127 11.1663L9.06872 13.1548C8.47834 13.7252 7.52117 13.7252 6.9308 13.1548C6.34043 12.5844 6.34043 11.6597 6.93082 11.0893L10.8696 7.28392"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div className={className('link')}>
        <a href={file.url} download>
          {file.name}
        </a>
      </div>
    </div>
  )
}
