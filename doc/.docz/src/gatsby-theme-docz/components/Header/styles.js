import * as mixins from '~utils/mixins'
import { media } from '~theme/breakpoints'

export const wrapper = {
  bg: 'header.bg',
  position: 'relative',
  zIndex: 1,
  borderBottom: t => `1px solid ${t.colors.border}`,
  height: '60px',
  border: '1px solid #CED4DE',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'FaktSoft, Helvetica, sans-serif',
  backgroundImage: 'linear-gradient(to right, rgb(146, 254, 157) 0%, rgb(0, 201, 255) 100%)',
}

export const innerContainer = {
  ...mixins.centerAlign,
  px: 4,
  flex: "1",
  position: 'relative',
  justifyContent: 'space-between',
  height: 60,
  maxWidth: '1200px',
  width: '100vw',
  margin: '0 auto',
  padding: '0 32px 0 32px',
}

export const menuIcon = {
  display: 'none',
  position: 'absolute',
  top: 'calc(100% + 15px)',
  left: 30,
  [media.tablet]: {
    display: 'block',
  },
}

export const menuButton = {
  ...mixins.ghostButton,
  color: 'header.text',
  opacity: 0.5,
  cursor: 'pointer',
}

export const headerButton = {
  ...mixins.centerAlign,
  outline: 'none',
  p: '12px',
  border: 'none',
  borderRadius: 9999,
  bg: 'header.button.bg',
  color: 'header.button.color',
  fontSize: 0,
  fontWeight: 600,
  cursor: 'pointer',
}

export const editButton = {
  ...mixins.centerAlign,
  position: 'absolute',
  bottom: -40,
  right: 30,
  bg: 'transparent',
  color: 'muted',
  fontSize: 1,
  textDecoration: 'none',
  borderRadius: 'radius',
}


export const nav = {
  display: 'flex',
  justifyContent: ' space-between',
  alignItems: 'center',
  flexFlow: 'row nowrap',
  gut: '10px',
}


export const link = {
  color: '#62636f',
  fontFamily: 'FaktSoft, Helvetica, sans-serif',
  textDecoration: 'none',
  ':hover': {
    color: 'rgb(39, 40, 51)',
    opacity: '1',
    transition: 'color 0.1s',
    cursor: 'pointer'
  }
}