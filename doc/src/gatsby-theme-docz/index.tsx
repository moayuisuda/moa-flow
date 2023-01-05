// src/gatsby-theme-docz/index.js
import React from 'react'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { ThemeProvider } from 'theme-ui'
import baseComponents from 'gatsby-theme-docz/src/components'
const componentsMap = {
  ...baseComponents,
  /* your custom components */
}
const Theme = ({ children }) => {
  console.log('进来了');
  const config = useConfig()
  return (
    <ThemeProvider theme={config}>
        <ComponentsProvider components={componentsMap}>
        {children}
        </ComponentsProvider>
    </ThemeProvider>
  )
}

const themeConfig = {
  colors: {
    primary: 'tomato',
    secondary: 'khaki',
    gray: 'lightslategray',
  },
}


// @ts-ignore
export default theme(themeConfig)(Theme)