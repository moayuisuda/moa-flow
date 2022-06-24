import React from "react";
import { Observer } from "mobx-react";

export const ConsumerBridge: <T>(props: {
  context: React.Context<T>;
  children: (value: T) => React.ReactElement;
}) => React.ReactElement = (props) => {
  return (
    <props.context.Consumer>
      {(value) => <Observer>{() => props.children(value)}</Observer>}
    </props.context.Consumer>
  );
};
