import React from 'react'

const kinds = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
}

export const Alert = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      background: 'white',
      borderRadius: 3,
      color: 'white',
      background: kinds[kind],
    }}
    {...rest}
  >
    {children}
  </div>
)
