import { Group } from "react-konva";
import React from "react";

import Cell from "@/cells/Cell";

export type PortType = {
  id: string;
  anchor: { x: number; y: number } | (() => { x: number; y: number });
};

class Port extends Cell<PortType, {}> {
  wrapperRef: React.RefObject<any>;
  static metaData = {
    source: undefined,
    target: undefined,
  };

  constructor(props, context) {
    super(props, context);
    context.model.setCellData(props.data.id);
  }

  componentDidMount(): void {
    const { data } = this.props;
    const { model } = this.context;
    if (!data.id) {
      this.context.model.setCellId(data);
      model.cellsMap.set(data.id, this);
      model.cellsDataMap.set(data.id, data);
    }
  }

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

  onLinkStart(e) {
    e.cancelBubble = true;

    const {
      model: {
        buffer: { link },
      },
    } = this.context;

    link.source = this.props.data.id;
    link.target = this.anchor();
  }

  onLinkEnd(e) {
    e.cancelBubble = true;

    const {
      model: {
        buffer: { link },
      },
      model,
    } = this.context;

    const target = this.props.data.id;

    if (link.source === target) {
      model.clearLinkBuffer();
    } else model.link(link.source, target);
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
