import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { FlowContext } from "../Context";
import { cloneDeep } from "lodash";
import { observer } from "mobx-react";
import Model from "../Model";

export type CellType = { id: string; cellType: string };

// D: data, S: state, P: props
abstract class Cell<D, S = {}, P = {}> extends React.Component<
  { data: D & CellType } & P,
  S
> {
  // 这样定义的是这个实例的属性，如this.xxx
  flowState: {
    isSelect: boolean;
  };
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  // static方法可以这样写abstract方法
  static getBounds: (cellData) => {
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
    this.flowState = {
      isSelect: false,
    };

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

  setData(data) {
    this.context;
    this.context.setCellData(this.props.data.id, data);
  }

  componentDidMount(): void {
    [
      "mouseenter",
      "mouseleave",
      "mousedown",
      "mouseup",
      "dblclick",
      "click",
    ].forEach((eventName) => {
      this.wrapperRef.current.on(eventName, (e) => {
        this.context.sendEvent({
          type: `cell:${eventName}`,
          data: {
            e,
            cellData: this.props.data,
          },
        });
      });
    });
  }

  isSelect() {
    return this.flowState.isSelect;
  }

  render() {
    return <Group ref={this.wrapperRef}>{this.content()}</Group>;
  }
}

export default observer(Cell as any) as typeof Cell;
