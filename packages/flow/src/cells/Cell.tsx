import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { FlowContext } from "../Context";
import { cloneDeep } from "lodash";
import { observer } from "mobx-react";

export type CellType = { id: string; type: string };

// D: data, S: state, P: props
abstract class Cell<D, S = {}, P = {}> extends React.Component<
  { data: D & CellType } & P,
  S
> {
  flowState: {
    isSelect: boolean;
  };
  static contextType = FlowContext;

  static getBounds: (cellData) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  abstract content(): JSX.Element;
  static metaData: any = { id: "" };

  wrapperRef: React.RefObject<any>;

  constructor(props, context) {
    super(props);
    context.cellsMap.set(props.data.id, this);
    this.flowState = {
      isSelect: false,
    };
    console.log(props.data);

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
      ...cloneDeep(re),
      component: componentName,
    };
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
