import React from "react";

import { CellDataType } from "../cells/Cell";
import { isFunction } from "lodash";
import { FlowContext } from "../Context";
import { FlowModel } from "../Model";
import { observer } from "mobx-react";
import { NodeDataType } from "../cells/Node";

export type PortDataType = {
  edges: string[];
  host: string;
  [index: string]: any;
} & CellDataType;

export type PortDir = "left" | "right" | "top" | "bottom";

type PortPropsType<D extends PortDataType> = {
  link?: (source: D, target: D) => boolean;
  dir?: PortDir;
  anchor: () => { x: number; y: number };
  data: D;
  children?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type PortData<D> = D & PortDataType;

@observer
export class Port<D extends PortDataType> extends React.Component<
  PortPropsType<D>
> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  wrapperRef: React.RefObject<any>;
  constructor(props: PortPropsType<D>, context: FlowModel) {
    super(props, context);
    if (!context.isMiniMap) context.cellsMap.set(props.data.id, this);
    this.wrapperRef = context.getWrapperRef(props.data.id);
  }

  get data() {
    return this.props.data;
  }

  anchor = () => {
    const host = this.data.host;
    const hostData = this.context.getCellData(host as string) as NodeDataType;
    const ownAnchor = this.props.anchor();
    return {
      x: ownAnchor.x + hostData.x,
      y: ownAnchor.y + hostData.y,
    };
  };

  onLinkStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

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
  };

  onLinkEnd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const {
      context,
      context: {
        buffer: { link },
      },
    } = this;

    if (!link.source) return;
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
        if (this.props.link(sourceData as any, this.props.data))
          adoptTarget = true;
        else adoptTarget = false;
      }

      if (adoptSource && adoptTarget)
        context.link(link.source as string, this.props.data.id);
      else context.clearLinkBuffer();
    } else {
      context.link(link.source as string, this.props.data.id);
    }
  };

  render() {
    const { link, anchor, data, ...others } = this.props;

    return (
      <div
        ref={this.wrapperRef}
        style={{
          cursor: "crosshair",
          display: "inline-block",
        }}
        onMouseDown={(e) => this.onLinkStart(e)}
        onMouseUp={(e) => this.onLinkEnd(e)}
        {...others}
      >
        {this.props.children}
      </div>
    );
  }
}
