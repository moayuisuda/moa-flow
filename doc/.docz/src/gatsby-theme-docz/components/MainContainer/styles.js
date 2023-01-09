import { media, breakpoints } from '~theme/breakpoints'

export const container = {
  width: 'calc(100vw - 312px)',
  backgroundColor: 'background',
  position: 'relative',
  py: 5,
  px: 4,
  variant: 'styles.Container',
  maxWidth: '1000px !important',
  [media.tablet]: {
    py: 4,
    px: 4,
    pt: 5,
  },
  [`@media (max-width: ${breakpoints.tablet}px)`]: {
    width: '100%'
  },
}
