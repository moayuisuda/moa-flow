import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import { Rect, Text, Circle, Group } from "react-konva";
import Button from "@/common/Button";
import Interactor from "@/scaffold/Interactor";
import Node from "../Node";
const { Port } = Interactor;

type MatrixNodeType = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
};

const meta = {};

const WIDTH = 200;
const HEIGHT = 160;

class MatrixNode extends Node<MatrixNodeType, {}> {
  static metaData = {
    fields: [{}],
    label: "",
  };

  getStroke = () => {
    const isSelect = this.context.model.selectCells.includes(this.props.id);
    const { color } = this.context.model;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  content() {
    const { model } = this.context;
    const { color = {} } = model;
    const { getStroke } = this;
    const { x, y, label } = this.props;

    return (
      <Interactor {...this.props}>
        <Rect
          width={WIDTH}
          height={HEIGHT}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.1}
          cornerRadius={10}
        />

        <Group>
          <Rect
            cornerRadius={[10, 10, 0, 0]}
            width={WIDTH}
            height={40}
            fill={color.grey}
          />
          <Text
            fontSize={14}
            text={label}
            height={40}
            x={20}
            verticalAlign="middle"
          ></Text>
          <Button
            x={WIDTH}
            width={20}
            height={40}
            text="＋"
            onClick={(e) => {
              // model.sendEvent(e);
              const a = model.createCellData("MatrixNode");
              console.log(a);
              debugger;
            }}
          />
        </Group>

        {/* // border */}
        <Rect
          width={WIDTH}
          height={HEIGHT}
          {...getStroke()}
          cornerRadius={10}
        />

        <Group y={40}>
          {this.props.ports?.map((portData, index) => (
            <Port
              key={portData.id}
              linkable={true}
              {...portData}
              anchor={() => {
                return {
                  x: x + 200,
                  y: y + 65 + index * 30,
                };
              }}
            >
              <Group x={150} y={20 + index * 30}>
                <Text text={portData.label}></Text>
                <Circle
                  stroke={color.primary}
                  fill="white"
                  y={6}
                  x={50}
                  radius={10}
                ></Circle>
              </Group>
            </Port>
          ))}
        </Group>
      </Interactor>
    );
  }
}

export default MatrixNode;
