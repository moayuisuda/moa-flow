import Cell from "../Cell";
import type { PortType, FieldType } from "../../types/common";
import { CellProps } from "../Cell";
import { Rect } from "react-konva";
import NodeBase from "../../scaffold/DragWrapper";
import Port from "../Port";

type MatrixNodeProps = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
} & CellProps;

class MatrixNode extends Cell<MatrixNodeProps, {}> {
  render() {
    return (
      <NodeBase x={this.props.x} y={this.props.y} id={this.props.id}>
        <Rect
          width={200}
          height={400}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
        />
        {/* {this.props.ports.map((portData) => (
          <Port {...portData} linkable={true} />
        ))} */}
      </NodeBase>
    );
  }
}

export default MatrixNode;
