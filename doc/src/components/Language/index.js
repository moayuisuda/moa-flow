/** @jsx jsx */

import React from "react";
import { jsx } from 'theme-ui'
import { IntlContextConsumer, changeLocale } from "gatsby-plugin-intl";
import * as styles from "./styles";

const languageShowMap = {
  en: "EN",
  zh: "中"
};

const Language = () => {
  return (
    <IntlContextConsumer>
      {({ language: currentLocale }) => {
        return (
          <a
            sx={styles.link}
            style={{ margin: "10px" }}
            onClick={() => {
              changeLocale(currentLocale === "en" ? "zh" : "en");
            }}
          >
            {languageShowMap[currentLocale === "en" ? "zh" : "en"]}
          </a>
        );
      }}
    </IntlContextConsumer>
  );
};

export default Language;
