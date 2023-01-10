

/** @jsx jsx */
import { jsx, Box, Flex, useColorMode } from 'theme-ui'
import { useConfig, useCurrentDoc } from 'docz'
import { Link } from "docz"
import * as styles from './styles'
import { Edit, Menu, Sun, Github } from '../Icons'
import Language from '../Language'


export const Header = props => {
  const { onOpen } = props
  const {
    repository,
    themeConfig: { showDarkModeSwitch, showMarkdownEditButton },
  } = useConfig()
  const { edit = true, ...doc } = useCurrentDoc()
  const [colorMode, setColorMode] = useColorMode()

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }

  const menuList = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Document',
      path: '/document/Api.mdx'
    }
  ]

  return (
    <div sx={styles.wrapper} data-testid="header">
      <Box sx={styles.menuIcon}>
        <button sx={styles.menuButton} onClick={onOpen}>
          <Menu size={25} />
        </button>
      </Box>
      <div sx={styles.innerContainer}>
        <h3>moa-flow</h3>
        <Flex>
          {repository && (
            <Box sx={{ mr: 2 }}>
              <a
                href={repository}
                sx={styles.headerButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
              </a>
            </Box>
          )}
          {showDarkModeSwitch && (
            <button
              sx={styles.headerButton}
              onClick={toggleColorMode}
              aria-label={`Switch to ${colorMode} mode`}
            >
              <Sun size={15} />
            </button>
          )}
        </Flex>
        {showMarkdownEditButton && edit && doc.link && (
          <a
            sx={styles.editButton}
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Edit width={14} />
            <Box sx={{ pl: 2 }}>Edit page</Box>
          </a>
        )}
        <div sx={styles.nav} >
          {
            menuList?.map(item => {
              return <Link sx={styles.link} to={item.path} key={item.path}>{item.name}</Link>
            })
          }
          <Language />
        </div>
      </div>

    </div>
  )
}
