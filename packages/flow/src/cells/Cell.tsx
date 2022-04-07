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
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  // static方法可以这样写abstract方法
  static getBounds: (cellData) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // 非static的abstract只能这样写
  abstract content(): JSX.Element;
  static metaData: any = { id: "" };

  wrapperRef: React.RefObject<any>;

  constructor(props, context) {
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

  setCellData(data) {
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

  render() {
    return <Group ref={this.wrapperRef}>{this.content()}</Group>;
  }
}

export default observer(Cell as any) as typeof Cell;
