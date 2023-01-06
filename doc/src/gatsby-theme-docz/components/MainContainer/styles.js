import { media } from '~theme/breakpoints'

export const container = {
  width: 'calc(100vw - 312px)',
  maxWidth: '860px',
  backgroundColor: 'background',
  position: 'relative',
  py: 5,
  px: 4,
  variant: 'styles.Container',
  [media.tablet]: {
    py: 4,
    px: 4,
    pt: 5,
  },
}
