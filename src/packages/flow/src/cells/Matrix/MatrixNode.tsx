import Cell from "../Cell";
import type { FieldType } from "../../types/common";
import { PortType } from "../Port";
import Port from "../Port";
import { Rect, Text, Circle, Group } from "react-konva";
import DragWrapper from "../../scaffold/DragWrapper";

type MatrixNodeType = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
};

class MatrixNode extends Cell<MatrixNodeType, {}> {
  static metaData = {
    type: "node",
    component: "MatrixNode",
    x: 0,
    y: 0,
    data: {},
    fields: [{}],
    label: "",
  };

  render() {
    const { model } = this.context;

    return (
      <DragWrapper x={this.props.x} y={this.props.y} id={this.props.id}>
        <Rect
          width={200}
          height={160}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.1}
          cornerRadius={10}
        />
        <Rect
          width={50}
          height={30}
          fill="red"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
          onClick={() => {
            model.addNode();
            model.sendEvent({
              type: "add",
              payload: {
                name: "matrix",
                action: "add",
              },
            });
          }}
        />
        <Text Text={this.props.label} width={200} align="center"></Text>
        {this.props.ports?.map((portData, index) => (
          <Port
            key={portData.id}
            linkable={true}
            {...portData}
            anchor={() => {
              return {
                x: this.props.x + 200,
                y: this.props.y + 25 + index * 30,
              };
            }}
          >
            <Group x={150} y={20 + index * 30}>
              <Text text={portData.label}></Text>
              <Circle
                stroke={"red"}
                fill="white"
                y={6}
                x={50}
                radius={10}
              ></Circle>
            </Group>
          </Port>
        ))}
      </DragWrapper>
    );
  }
}

export default MatrixNode;
