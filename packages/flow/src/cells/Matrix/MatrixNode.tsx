import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import { Rect, Text, Circle, Group } from "react-konva";
import Button from "@/common/Button";
import Interactor from "@/scaffold/Interactor";
import Node from "../Node";
const { Port } = Interactor;

type MatrixPortType = PortType & { label: string };

type MatrixNodeType = {
  ports?: MatrixPortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
};

const WIDTH = 200;
const HEIGHT = 160;

class MatrixNode extends Node<MatrixNodeType, {}> {
  static metaData = {
    fields: [{}],
    label: "",
  };

  getStroke = () => {
    const isSelect = this.context.model.selectCells.includes(
      this.props.data.id
    );
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
    const { x, y, label, ports } = this.props.data;

    return (
      <Interactor {...this.props.data} topOnFocus>
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
              const id = model.addCell("MatrixNode", {
                x: this.props.data.x + 300,
                y: this.props.data.y,
                label: "new node",
                ports: [
                  {
                    label: "new",
                  },
                ],
              });

              model.sendEvent({
                type: "chore",
                data: `cell [${id}] has been added`,
              });

              Promise.resolve().then(() => {
                const nextData = model.getCellData(id);
                model.link(ports[0].id, nextData.ports[0].id);
              });
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
          {this.props.data.ports?.map((portData, index) => (
            <Group x={150} y={20 + index * 30} key={portData.label}>
              <Text text={portData.label}></Text>
              <Port
                data={portData}
                anchor={() => {
                  return {
                    x: x + 200,
                    y: y + 65 + index * 30,
                  };
                }}
              >
                <Circle
                  stroke={color.primary}
                  fill="white"
                  y={6}
                  x={50}
                  radius={10}
                ></Circle>
              </Port>
            </Group>
          ))}
        </Group>
      </Interactor>
    );
  }
}

export default MatrixNode;
