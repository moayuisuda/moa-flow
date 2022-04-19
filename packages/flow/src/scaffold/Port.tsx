import { Group } from "react-konva";
import React from "react";

import Cell from "../cells/Cell";
import { CellType } from "../cells/Cell";
import { KonvaEventObject } from "konva/lib/Node";

export type PortType = {
  id: string;
  anchor: { x: number; y: number } | (() => { x: number; y: number });
  edges?: string[];
  host: string;
} & CellType;

class Port extends Cell<
  PortType,
  {},
  {
    link: (source: PortType & unknown, target: PortType & unknown) => boolean;
  }
> {
  wrapperRef: React.RefObject<any>;
  static metaData = {
    type: "port",
    source: undefined,
    target: undefined,
  };

  constructor(props, context) {
    super(props, context);
    context.setCellData(props.data.id);
  }

  // 暂时废弃
  anchor() {
    const konvaNode = this.wrapperRef.current;
    if (!konvaNode) return { x: 0, y: 0 };

    const rect = konvaNode.getClientRect({
      // 有relative不会caculate scale
      relativeTo: this.getStage(konvaNode),
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
      const sourceData = context.getCellData(link.source);

      if (sourceInstance.props.link) {
        if (sourceInstance.props.link(sourceData, this.props.data))
          adoptSource = true;
        else adoptSource = false;
      }
      if (this.props.link) {
        if (this.props.link(sourceData as PortType, this.props.data))
          adoptTarget = true;
        else adoptTarget = false;
      }

      if (adoptSource && adoptTarget)
        context.link(link.source, this.props.data.id);
      else context.clearLinkBuffer();
    } else {
      context.link(link.source, this.props.data.id);
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
