import Cell from "../Cell";
import type { FieldType } from "../../types/common";
import { PortType } from "../Port";
import Port from "../Port";
import { Rect, Text, Circle, Group } from "react-konva";
import DragWrapper from "../../scaffold/DragWrapper";
import { observer } from "mobx-react";

const HEIGHT = 100;
const WIDTH = 200;

type TuringNodeType = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
};

@observer
class TuringNode extends Cell<TuringNodeType, {}> {
  static metaData = {
    type: "node",
    component: "TuringNode",
    x: 0,
    y: 0,
    data: {},
    fields: [{}],
    label: "",
  };

  render() {
    return (
      <DragWrapper x={this.props.x} y={this.props.y} id={this.props.id}>
        <Rect
          stroke="blue"
          strokeWidth={4}
          width={WIDTH}
          height={HEIGHT}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.1}
          cornerRadius={10}
        />
        <Text
          width={WIDTH}
          Text={this.props.label}
          height={HEIGHT}
          verticalAlign="middle"
          align="center"
          fontSize={20}
        ></Text>
        {this.props.ports?.map((portData, index) => (
          <Port
            key={portData.id}
            linkable={true}
            {...portData}
            anchor={() => {
              return {
                x: this.props.x,
                y: this.props.y + 25 + index * 30,
              };
            }}
          >
            <Group x={0} y={20 + index * 30}>
              <Circle stroke={"blue"} fill="white" y={6} radius={10}></Circle>
              <Text x={20} text={portData.label}></Text>
            </Group>
          </Port>
        ))}
      </DragWrapper>
    );
  }
}

export default TuringNode;
