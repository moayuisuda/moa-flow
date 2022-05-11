import React from "react";
import { HTML as RGHTML, HTMLStyleProps } from "@antv/react-g";
import ReactDOM from "react-dom";

export const HTML = ({
  children,
  ...others
}: Omit<HTMLStyleProps, "innerHTML"> & {
  children: React.ReactElement;
}) => {
  const [div] = React.useState(() => document.createElement("div"));

  React.useLayoutEffect(() => {
    ReactDOM.render(children, div);
    
    return () => {
      ReactDOM.unmountComponentAtNode(div);
      div.parentNode?.removeChild(div);
    };
  }, []);

  return <RGHTML innerHTML={div} {...others} />;
};
