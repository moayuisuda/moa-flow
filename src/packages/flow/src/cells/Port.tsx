import Cell from "./Cell";
import { Group } from "react-konva";
import React from "react";

export type PortType = {
  linkable?: boolean;
  id: string;
  edges: string[];
  label?: string;
  anchor: { x: number; y: number } | (() => { x: number; y: number });
};

class Port extends Cell<PortType, {}> {
  wrapperRef: React.RefObject<any>;

  constructor(props, context) {
    super(props, context);
    this.wrapperRef = React.createRef();
  }

  linkTo() {}

  onLinkStart(e) {}
  onLinkMove(e) {}
  onLinkEnd(e) {}

  render() {
    return (
      <Group
        ref={this.wrapperRef}
        onMouseDown={(e) => this.onLinkStart(e)}
        onMouseMove={(e) => this.onLinkMove(e)}
        onMouseUp={(e) => this.onLinkEnd(e)}
      >
        {this.props.children}
      </Group>
    );
  }
}

export default Port;
