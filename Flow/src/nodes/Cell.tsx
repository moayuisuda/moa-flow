import React from "react";
import { FlowContext } from "../Context";

export type CellProps = {
  type: string;
  id: string;
};

class Cell<P, S> extends React.Component<P, S> {
  static contextType = FlowContext;

  constructor(props, context) {
    super(props);
    context.model.cellsMap[props.id] = this;
  }

  static registComponent(model) {
    model.componentsMap[this.name] = this;
  }
}

export default Cell;
