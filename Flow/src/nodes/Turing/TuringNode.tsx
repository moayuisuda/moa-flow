import Cell from "../Cell";
import type { PortType, FieldType } from "../../types/common";
import { CellProps } from "../Cell";
import { Rect } from "react-konva";
import NodeBase from "../../scaffold/DragWrapper";

type MatrixNodeProps = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
} & CellProps;

class MatrixNode extends Cell<MatrixNodeProps, {}> {
  render() {
    return (
      <NodeBase {...this.props}>
        <Rect
          width={200}
          height={400}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
        ></Rect>
        {this.props}
      </NodeBase>
    );
  }
}

export default MatrixNode;
