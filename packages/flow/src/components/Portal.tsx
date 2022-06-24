import React from "react";
import { HTML as RGHTML } from "@antv/react-g";
import { HTMLStyleProps } from "@antv/g";
import ReactDOM from "react-dom";
import { observer, Observer } from "mobx-react";
import { useModel } from "../hooks/useModel";
import { FlowContext } from "../Context";

export const Portal = ({
  children,
  ...others
}: Omit<HTMLStyleProps, "innerHTML" | "width" | "height"> & {
  children: React.ReactNode;
}) => {
  const context = useModel();

  const [div] = React.useState(() => document.createElement("div"));

  React.useLayoutEffect(() => {
    ReactDOM.render(
      <FlowContext.Provider value={context}>
        <Observer>
          {() => {
            console.log("change");
            return children as React.ReactElement;
          }}
        </Observer>
      </FlowContext.Provider>,
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
