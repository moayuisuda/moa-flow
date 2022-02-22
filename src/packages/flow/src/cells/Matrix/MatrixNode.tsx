import Cell from "../Cell";
import type { FieldType } from "../../types/common";
import { PortType } from "../Port";
import Port from "../Port";
import { Rect, Text, Circle, Group, Line } from "react-konva";
import Interactor from "../../scaffold/Interactor";
import { observer } from "mobx-react";
import { color } from "../../global/style";
import Button from "../../common/Button";

type MatrixNodeType = {
  ports?: PortType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
};

const WIDTH = 200;
const HEIGHT = 160;

@observer
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

  getStroke = () => {
    const isSelect = this.context.model.selectCells.includes(this.props.id);

    if (isSelect) {
      return {
        stroke: color.orange,
      };
    } else return {};
  };

  render() {
    const { model } = this.context;
    const { getStroke } = this;
    const { x, y, id, label } = this.props;

    return (
      <Interactor x={x} y={y} id={id}>
        <Group>
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
                model.sendEvent(e);
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
                    x: this.props.x + 200,
                    y: this.props.y + 65 + index * 30,
                  };
                }}
              >
                <Group x={150} y={20 + index * 30}>
                  <Text text={portData.label}></Text>
                  <Circle
                    stroke={color.orange}
                    fill="white"
                    y={6}
                    x={50}
                    radius={10}
                  ></Circle>
                </Group>
              </Port>
            ))}
          </Group>
        </Group>
      </Interactor>
    );
  }
}

export default MatrixNode;
