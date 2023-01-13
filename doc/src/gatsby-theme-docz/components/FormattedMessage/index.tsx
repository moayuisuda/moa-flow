import { useIntl } from "gatsby-plugin-intl";
import React from "react";

export const FormattedMessage = (props: { id: string }) => {
  const { id } = props;
  const intl = useIntl();
  return <div>{intl.formatMessage({ id })}</div>;
};
