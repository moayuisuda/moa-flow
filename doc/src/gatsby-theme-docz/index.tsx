// src/gatsby-theme-docz/index.js
import React from "react";
import { theme, useConfig, ComponentsProvider } from "docz";
import { ThemeProvider } from "theme-ui";
import baseComponents from "./components";
const componentsMap = {
  ...baseComponents
  /* your custom components */
};
import baseTheme from "gatsby-theme-docz/src/theme";
const Theme = ({ children }) => {
  const config = useConfig();

  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={componentsMap}>
        {children}
      </ComponentsProvider>
    </ThemeProvider>
  );
};
const themeConfig = {
  colorMode: "light",
  // showMarkdownEditButton:true,
  showDarkModeSwitch: false
  // showPlaygroundEditor:true,
  // showLiveError:true,
  // showLivePreview:true,
  // useScopingInPlayground:true
};

// @ts-ignore
export default theme({ ...baseTheme, ...themeConfig })(Theme);
