import React, { FunctionComponent, SVGAttributes } from 'react'

export interface SendMessageButtonProps extends SVGAttributes<SVGElement> {
  size?: number
}

export const SendMessageButton: FunctionComponent<SendMessageButtonProps> = ({
  size,
  ...attributes
}) => {
  return (
    <svg
      version="1.1"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...attributes}
    >
      <g
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinejoin="round"
      >
        <line x1="10.88" x2="5.39" y1="12" y2="12" vectorEffect="non-scaling-stroke"></line>
        <path
          vectorEffect="non-scaling-stroke"
          d="M5.24292 3.63014l14.5921 7.29416 7.29695e-08 3.64636e-08c.594093.296874.835036 1.01915.538161 1.61324 -.116393.23292-.305241.421769-.538161.538161l-14.5921 7.29416 -4.97783e-10 2.48953e-10c-.594173.297159-1.31674.0563828-1.6139-.53779 -.130997-.26193-.161939-.562654-.0870207-.84577l1.85048-6.9863 -1.85048-6.9863 -6.82793e-09-2.58029e-08c-.169947-.642233.212917-1.30063.85515-1.47058 .283117-.0749179.58384-.0439767.84577.0870207Z"
        ></path>
      </g>
    </svg>
  )
}
