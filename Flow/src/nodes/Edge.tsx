import { PortType } from "../types/common";
import Cell from "./Cell";
import { Group, Line } from "react-konva";

class Edge extends Cell<PortType, {}> {
  source;
  target;

  render() {
    return (
      <Group
        onClick={(e) => {
          this.context.onClick({
            event: e,
            cell: this,
          });
        }}
      >
        <Line></Line>
      </Group>
    );
  }
}

export default Edge;
