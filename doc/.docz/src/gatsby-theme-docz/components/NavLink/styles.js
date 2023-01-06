export const sideBarToLink = '#8492A6'
export const sideBarToLinkActive = '#4263F7'
export const link = {
  my: 2,
  display: 'block',
  color: sideBarToLink,
  textDecoration: 'none',
  fontSize: 2,
  '&.active': {
    color: sideBarToLinkActive,
  },
}

export const smallLink = {
  ...link,
  ml: 3,
  fontSize: 1,
  position: 'relative',
  color: sideBarToLink,
  '&.active': {
    color: sideBarToLinkActive,
  },

  '&.active::before': {
    content: '""',
    position: 'absolute',
    display: 'block',
    top: '2px',
    left: -2,
    height: '1rem',
    backgroundColor: 'primary',
    transition: 'width 200ms ease 0s',
    width: '2px',
    borderRadius: 1,
  },
}
