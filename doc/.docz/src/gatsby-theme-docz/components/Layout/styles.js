import { media, breakpoints } from '~theme/breakpoints'

export const main = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}

export const wrapper = {
  margin: '0 auto',
  maxWidth: '1240px',
  py: 0,
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '250px minmax(0, 1fr)',
  minHeight: 'calc(100vh - 70px)',
  [media.tablet]: {
    display: 'block',
  },
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    width: '100%'
  },
}
