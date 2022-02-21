import React from "react";
import { FlowContext } from "../Context";
import _ from "lodash";

export type CellType = {
  id: string;
};

class Cell<P, S> extends React.Component<P & CellType, S> {
  static contextType = FlowContext;
  static metaData;

  constructor(props, context) {
    super(props);
    context.model.cellsMap.set(props.id, this);
  }

  static registComponent(model) {
    model.componentsMap.set(this.name, this);
  }

  setCellData(data) {
    this.context.setCellData(this.props.id, data);
  }
}

export default Cell;
