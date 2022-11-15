import { File } from '@source-health/client'
import React, { FunctionComponent } from 'react'

export interface AvatarProps {
  file: File | null
  size?: number
}

export const Avatar: FunctionComponent<AvatarProps> = ({ file, size = 36 }) => {
  if (!file) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${size}px`,
          background: '#f1f4f7',
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size}px`,
        backgroundImage: `url(${file.url})`,
        backgroundSize: 'cover',
      }}
    />
  )
}
