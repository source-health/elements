import React, { FunctionComponent, memo } from 'react'

import { useClassFactory } from '../../hooks'

export interface LoadingProps {
  /** Set the color of the LoadingIndicator */
  color?: string
  /** The size of the loading icon, @default 15px */
  size?: number
}

export const Loading: FunctionComponent<LoadingProps> = memo(({ color = '#006CFF', size = 15 }) => {
  const className = useClassFactory('common', 'loading')

  return (
    <div
      className={className()}
      data-testid="loading-indicator"
      style={{ height: size, width: size }}
    >
      <svg height={size} viewBox={'0 0 30 30'} width={size} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0" />
            <stop
              data-testid="loading-indicator-circle"
              offset="100%"
              stopColor={color}
              stopOpacity="1"
              style={{ stopColor: color }}
            />
          </linearGradient>
        </defs>
        <path
          d="M2.518 23.321l1.664-1.11A12.988 12.988 0 0 0 15 28c7.18 0 13-5.82 13-13S22.18 2 15 2V0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-5.206 0-9.792-2.652-12.482-6.679z"
          fill="url(#a)"
          fillRule="evenodd"
        />
      </svg>
    </div>
  )
})
