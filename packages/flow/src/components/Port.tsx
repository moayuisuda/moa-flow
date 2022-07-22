import React from "react";

import { CellDataType } from "../cells/Cell";
import { isFunction } from "lodash";
import { FlowContext } from "../Context";
import { FlowModel } from "../Model";
import { observer } from "mobx-react";

export type PortDataType = {
  edges?: string[];
  host?: string;
} & CellDataType;

type PortPropsType = {
  link?: (source: any, target: any) => boolean;
  x?: number;
  y?: number;
  anchor: { x: number; y: number } | (() => { x: number; y: number });
  data: PortDataType;
};

export type PortData<D> = D & PortDataType;

@observer
export class Port extends React.Component<PortPropsType> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  static defaultData: PortDataType = {
    id: "",
    component: "Port",
    cellType: "port",
    source: undefined,
    target: undefined,
  };

  wrapperRef: React.RefObject<any>;
  constructor(
    props: PortPropsType & { data: PortDataType },
    context: FlowModel
  ) {
    super(props, context);
    context.cellsMap.set(props.data.id, this);
    this.wrapperRef = context.getWrapperRef(props.data.id);
  }

  get data() {
    return this.props.data;
  }

  anchor() {
    return isFunction(this.props.anchor)
      ? this.props.anchor()
      : this.props.anchor;
  }

  onLinkStart(e: React.MouseEvent) {
    e.stopPropagation();

    const {
      context: {
        buffer: { link },
      },
    } = this;

    this.context.emitEvent({
      type: "beforeLink",
      data: {
        source: this.props.data.id,
      },
    });

    link.source = this.props.data.id;
    link.target = this.anchor();
  }

  onLinkEnd(e: React.MouseEvent) {
    e.stopPropagation();

    const {
      context,
      context: {
        buffer: { link },
      },
    } = this;

    const sourceInstance = context.cellsMap.get(link.source as string);

    if (link.source === this.props.data.id) {
      context.clearLinkBuffer();
    } else if (this.props.link || sourceInstance.props.link) {
      let adoptSource = true;
      let adoptTarget = true;
      const sourceData = context.getCellData(link.source as string);

      if (sourceInstance.props.link) {
        if (sourceInstance.props.link(sourceData, this.props.data))
          adoptSource = true;
        else adoptSource = false;
      }
      if (this.props.link) {
        if (this.props.link(sourceData as PortDataType, this.props.data))
          adoptTarget = true;
        else adoptTarget = false;
      }

      if (adoptSource && adoptTarget)
        context.link(link.source as string, this.props.data.id);
      else context.clearLinkBuffer();
    } else {
      context.link(link.source as string, this.props.data.id);
    }
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        style={{
          userSelect: 'none',
          cursor: "crosshair",
          display: 'inline-block'
        }}
        onMouseDown={(e) => this.onLinkStart(e)}
        onMouseUp={(e) => this.onLinkEnd(e)}
      >
        {this.props.children}
      </div>
    );
  }
}
