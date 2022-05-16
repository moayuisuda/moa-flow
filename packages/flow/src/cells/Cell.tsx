import React from "react";
import { Group } from "@antv/react-g";
import { FlowContext } from "../Context";
import { cloneDeep, isUndefined } from "lodash";
import { observer } from "mobx-react";
import Model from "../Model";
import { titleCase } from "utils/string";
import { InteractivePointerEvent } from "@antv/g";

export type CellDataType = {
  id: string;
  visible?: boolean;
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
  static getBounds: (cellData: any) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // 如果是content: () => xxx 对应的是instance property，这种写法是instance function
  abstract content(): JSX.Element;

  onMount(): void {}

  static metaData: any = { id: "" };

  wrapperRef: React.RefObject<any>;

  constructor(props: any, context: Model) {
    super(props);
    context.cellsMap.set(props.data.id, this);

    this.wrapperRef = React.createRef();
  }

  static regist(name: string, model: Model) {
    model.componentsMap.set(name, this);
  }

  static getMetaData() {
    const re = {};
    let curr = this as any;

    // 合并父类metaData
    while (curr !== (React.Component as any)) {
      Object.assign(re, curr.metaData);
      curr = curr.__proto__;
    }

    return cloneDeep(re);
  }

  setData(data: any) {
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
      this.wrapperRef.current.on(eventName, (e: InteractivePointerEvent) => {
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
      });
    });

    this.onMount && this.onMount();
  }

  getData() {
    return this.props.data;
  }

  isSelect() {
    return this.props.data.$state.isSelect;
  }

  render() {
    return (
      <Group
        ref={(ref) => {
          this.wrapperRef.current = ref;
        }}
      >
        {isUndefined(this.props.data.visible) || this.props.data.visible ? (
          <Group>{this.content()}</Group>
        ) : (
          <></>
        )}
      </Group>
    );
  }
}

export default observer(Cell as any) as typeof Cell;
