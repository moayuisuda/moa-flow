import Cell, { CellType } from "../Cell";
import type { FieldType } from "../../types/common";
import { PortType } from "../Port";
import Port from "../Port";
import { Rect, Text, Circle, Group } from "react-konva";
import DragWrapper from "../../scaffold/DragWrapper";
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

  componentDidUpdate(
    prevProps: Readonly<MatrixNodeType & CellType>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    // console.log("updated");
  }

  render() {
    const { model } = this.context;

    return (
      <DragWrapper x={this.props.x} y={this.props.y} id={this.props.id}>
        <Group>
          <Rect
            width={200}
            height={160}
            fill="white"
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.1}
            cornerRadius={10}
          />
          <Group>
            <Rect
              cornerRadius={[10, 10, 0, 0]}
              width={200}
              height={40}
              fill={color.grey}
            />
            <Text
              fontSize={14}
              text={this.props.label}
              height={40}
              x={20}
              verticalAlign="middle"
            ></Text>
            <Button
              x={140}
              y={4}
              width={70}
              text="click"
              onClick={(e) => {
                model.sendEvent(e);
              }}
            />
          </Group>

          <Group y={40}>
            {this.props.ports?.map((portData, index) => (
              <Port
                key={portData.id}
                linkable={true}
                {...portData}
                anchor={() => {
                  return {
                    x: this.props.x + 200,
                    y: this.props.y + 35 + index * 30,
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
      </DragWrapper>
    );
  }
}

export default MatrixNode;
