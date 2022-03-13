import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { FlowContext } from "../Context";
import _ from "lodash";
import { observer } from "mobx-react";

export type CellType = { id: string };

abstract class Cell<P, S> extends React.Component<{ data: P & CellType }, S> {
  static contextType = FlowContext;

  abstract content(): JSX.Element;
  static metaData: any = { id: "" };

  wrapperRef: React.RefObject<any>;

  constructor(props, context) {
    super(props);
    context.model.cellsMap.set(props.data.id, this);
    context.model.cellsDataMap.set(props.data.id, props.data);

    this.wrapperRef = React.createRef();
  }

  static regist(model) {
    model.componentsMap.set(this.name, this);
  }

  static getMetaData() {
    const re = {};
    let curr = this as any;

    const componentName = this.name;
    // 合并父类metaData
    while (curr !== (React.Component as any)) {
      Object.assign(re, curr.metaData);
      curr = curr.__proto__;
    }

    return {
      ...re,
      component: componentName,
    };
  }

  isSelected() {
    return this.context.model.canvasData.cells.includes();
  }

  getStage(konvaNode) {
    let re = konvaNode;

    while (re.__proto__.constructor !== Konva.Stage) {
      re = re.parent;
    }

    return re;
  }

  setCellData(data) {
    this.context.setCellData(this.props.data.id, data);
  }

  render() {
    return <Group ref={this.wrapperRef}>{this.content()}</Group>;
  }
}

export default observer(Cell as any) as typeof Cell;
