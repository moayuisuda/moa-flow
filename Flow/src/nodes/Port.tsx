import Cell from "./Cell";
import { FieldType, PortType } from "../types/common";
import { CellProps } from "./Cell";
import { Group } from "react-konva";

class Port extends Cell<PortType, {}> {
  source;
  target;

  linkTo() {}

  onLinkStart(e) {}
  onLinkMove(e) {}
  onLinkEnd(e) {}

  render() {
    return (
      <Group
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
