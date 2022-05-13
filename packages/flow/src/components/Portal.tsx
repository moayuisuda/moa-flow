import React from "react";
import { HTML as RGHTML } from "@antv/react-g";
import { HTMLStyleProps } from "@antv/g";
import ReactDOM from "react-dom";

export const Portal = ({
  children,
  ...others
}: Omit<HTMLStyleProps, "innerHTML"> & {
  children: React.ReactElement;
}) => {
  const [div] = React.useState(() => document.createElement("div"));

  React.useLayoutEffect(() => {
    ReactDOM.render(<>{children}</>, div);
  });

  React.useEffect(() => {
    return () => {
      ReactDOM.unmountComponentAtNode(div);
    };
  }, []);

  return <RGHTML innerHTML={div} {...others} width={0} height={0} />;
};
