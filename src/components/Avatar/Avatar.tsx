import React, { FunctionComponent } from 'react'

export interface AvatarProps {
  size?: number
}

export const Avatar: FunctionComponent<AvatarProps> = ({ size = 36 }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size}px`,
        backgroundImage: 'url(https://randomuser.me/api/portraits/women/47.jpg)',
        backgroundSize: 'cover',
      }}
    />
  )
}
