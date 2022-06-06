import React from "react";
import { HTML as RGHTML } from "@antv/react-g";
import { HTMLStyleProps } from "@antv/g";
import ReactDOM from "react-dom";
import { observer, Observer } from "mobx-react";

export const Portal = ({
  children,
  ...others
}: Omit<HTMLStyleProps, "innerHTML" | "width" | "height"> & {
  children: React.ReactNode;
}) => {
  const [div] = React.useState(() => document.createElement("div"));
  console.log({ div });

  React.useLayoutEffect(() => {
    ReactDOM.render(
      <Observer>
        {() => {
          console.log("change");
          return children as React.ReactElement;
        }}
      </Observer>,
      div
    );
  });

  React.useEffect(() => {
    return () => {
      ReactDOM.unmountComponentAtNode(div);
    };
  }, []);

  return <RGHTML innerHTML={div} {...others} width={0} height={0} />;
};
