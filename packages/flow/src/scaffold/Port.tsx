import { Group } from "react-konva";
import React from "react";

import Cell from "../cells/Cell";
import { CellDataType } from "../cells/Cell";
import { KonvaEventObject } from "konva/lib/Node";
import FlowModel from "../Model";

export type PortDataType = {
  edges?: string[];
  host?: string;
} & CellDataType;

type PortPropsType = {
  // link: (source: PortDataType, target: PortDataType) => boolean;
  // @TODO
  link?: (source: any, target: any) => boolean;
  x?: number;
  y?: number;
  anchor?: { x: number; y: number } | (() => { x: number; y: number });
};

class Port extends Cell<PortDataType, {}, PortPropsType> {
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

  // 暂时废弃
  anchor() {
    const konvaNode = this.wrapperRef.current;
    if (!konvaNode) return { x: 0, y: 0 };

    const rect = konvaNode.getClientRect({
      // 有relative不会caculate scale
      relativeTo: this.getStage(),
    });

    // 通过变换矩阵将坐标还原为标准坐标
    // const t = konvaNode.getAbsoluteTransform();

    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };
  }

  onLinkStart(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true;

    const {
      context: {
        buffer: { link },
      },
    } = this;

    this.context.sendEvent({
      type: "beforeLink",
      data: {
        source: this.props.data.id,
      },
    });

    link.source = this.props.data.id;
    link.target = this.anchor();
  }

  onLinkEnd(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true;

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
        onMouseDown={(e) => this.onLinkStart(e)}
        onMouseUp={(e) => this.onLinkEnd(e)}
        {...this.props}
      >
        {this.props.children}
      </Group>
    );
  }
}

export default Port;
