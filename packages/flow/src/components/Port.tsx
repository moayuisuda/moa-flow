import { Group } from "@antv/react-g";
import { InteractivePointerEvent } from "@antv/g";
import React from "react";

import Cell from "../cells/Cell";
import { CellDataType } from "../cells/Cell";
import FlowModel from "../Model";
import { isFunction } from "lodash";

export type PortDataType = {
  edges?: string[];
  host?: string;
} & CellDataType;

type PortPropsType = {
  link?: (source: any, target: any) => boolean;
  x?: number;
  y?: number;
  anchor: { x: number; y: number } | (() => { x: number; y: number });
};

export class Port extends Cell<PortDataType, {}, PortPropsType> {
  wrapperRef: React.RefObject<any>;
  static metaData = {
    cellType: "port",
    source: undefined,
    target: undefined,
  };

  constructor(
    props: PortPropsType & { data: PortDataType },
    context: FlowModel
  ) {
    super(props, context);
  }

  anchor() {
    return isFunction(this.props.anchor)
      ? this.props.anchor()
      : this.props.anchor;
  }

  onLinkStart(e: InteractivePointerEvent) {
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

  onLinkEnd(e: InteractivePointerEvent) {
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

  content() {
    return (
      <Group
        cursor="crosshair"
        onMousedown={(e: InteractivePointerEvent) => this.onLinkStart(e)}
        onMouseup={(e: InteractivePointerEvent) => this.onLinkEnd(e)}
        x={this.props.x || 0}
        y={this.props.y || 0}
      >
        {this.props.children}
      </Group>
    );
  }
}
