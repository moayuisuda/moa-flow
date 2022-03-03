import React from "react";
import { FlowContext } from "../Context";
import _ from "lodash";
import { observer } from "mobx-react";

export type CellType = { id: string };

abstract class Cell<P, S> extends React.Component<P & CellType, S> {
  static contextType = FlowContext;

  abstract content(): JSX.Element;
  static metaData: any = { id: "" };

  constructor(props, context) {
    super(props);
    context.model.cellsMap.set(props.id, this);
  }

  static registComponent(model) {
    model.componentsMap.set(this.name, this);
  }

  static getMetaData() {
    const re = {};
    let curr = this;
    while (curr !== React.Component) {
      Object.assign(re, curr.metaData);
      curr = curr.__proto__;
    }

    return re;
  }

  setCellData(data) {
    this.context.setCellData(this.props.id, data);
  }

  isSelected() {
    return this.context.model.canvasData.cells.includes();
  }

  render() {
    return <>{this.content()}</>;
  }
}

export default observer(Cell as any) as typeof Cell;
