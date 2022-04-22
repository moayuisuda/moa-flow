import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { FlowContext } from "../Context";
import { cloneDeep } from "lodash";
import { observer } from "mobx-react";
import Model from "../Model";
import { AllCellDataType } from "../types/common";
import { titleCase } from "utils/string";

export type CellDataType = {
  id: string;
  cellType: string;
  component: string;
  [key: string]: any;
};

// D: data, S: state, P: props
abstract class Cell<D, S = {}, P = {}> extends React.Component<
  { data: D & CellDataType } & P,
  S
> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  // static方法可以这样写abstract方法
  static getBounds: (cellData: AllCellDataType) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // 如果是content: () => xxx 对应的是instance property，这种写法是instance function
  abstract content(): JSX.Element;
  static metaData: any = { id: "" };

  wrapperRef: React.RefObject<any>;

  constructor(props: any, context: Model) {
    super(props);
    context.cellsMap.set(props.data.id, this);

    this.wrapperRef = React.createRef();
  }

  static regist(model: Model) {
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

  getStage(konvaNode: Konva.Node) {
    let re = konvaNode;

    while (re.__proto__.constructor !== Konva.Stage) {
      re = re.parent;
    }

    return re;
  }

  setData(data: any) {
    this.context;
    this.context.setCellData(this.props.data.id, data);
  }

  onMount: () => void;

  componentDidMount(): void {
    [
      "mouseenter",
      "mouseleave",
      "mousedown",
      "mouseup",
      "dblclick",
      "click",
    ].forEach((eventName) => {
      this.wrapperRef.current.on(
        eventName,
        (e: Konva.KonvaEventObject<MouseEvent>) => {
          const instanceEventFn = this[`on${titleCase(eventName)}`];
          instanceEventFn && instanceEventFn.call(this, e);

          this.context.sendEvent({
            type: `cell:${eventName}`,
            data: {
              e,
              cellData: this.props.data,
              cell: this,
            },
          });
        }
      );
    });

    this.onMount && this.onMount();
  }

  getData() {
    return this.props.data;
  }

  isSelect() {
    // return this.flowState.isSelect;
    // @TODO 注入runtime的$state属性
    return this.context.selectCells.includes(this.props.data.id);
  }

  render() {
    return <Group ref={this.wrapperRef}>{this.content()}</Group>;
  }
}

export default observer(Cell as any) as typeof Cell;
