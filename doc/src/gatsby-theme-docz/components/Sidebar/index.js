/** @jsx jsx */
import { Fragment, forwardRef, useState, useRef, useEffect } from 'react'
import { Global } from '@emotion/react'
import { jsx, Box } from 'theme-ui'
import { useMenus, useCurrentDoc } from 'docz'
import { useIntl } from "gatsby-plugin-intl";
import * as styles from './styles'
import { NavSearch } from '../NavSearch'
import { NavLink } from '../NavLink'
import { NavGroup } from '../NavGroup'
import { FormattedMessage } from '@components/FormattedMessage'
export const Sidebar = forwardRef(function Sidebar(props, ref) {
  const [query, setQuery] = useState('')
  const menus = useMenus({ query })
  const currentDoc = useCurrentDoc()
  const currentDocRef = useRef()
  const intl = useIntl();

  const handleChange = ev => {
    setQuery(ev.target.value)
  }
  useEffect(() => {
    if (ref.current && currentDocRef.current) {
      ref.current.scrollTo(0, currentDocRef.current.offsetTop)
    }
  }, [])
  return (
    <Fragment>
      <Box onClick={props.onClick} sx={styles.overlay(props)}>
        {props.open && <Global styles={styles.global} />}
      </Box>
      <Box ref={ref} sx={styles.wrapper(props)} data-testid="sidebar">
        <NavSearch
          placeholder={intl.formatMessage({ id: 'typeToSearch' })}
          value={query}
          onChange={handleChange}
        />
        {menus &&
          menus.map(menu => {
            if (!menu.route)
              return <NavGroup key={menu.id} item={menu} sidebarRef={ref} />
            if (menu.route === currentDoc.route) {
              return (
                <NavLink key={menu.id} item={menu} ref={currentDocRef}>
                  <FormattedMessage id={menu.name} />
                </NavLink>
              )
            }
            return (
              <NavLink key={menu.id} item={menu}>
                <FormattedMessage id={menu.name} />
              </NavLink>
            )
          })}
      </Box>
    </Fragment>
  )
})
