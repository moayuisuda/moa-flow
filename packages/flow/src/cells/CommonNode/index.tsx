import type { FieldType } from "../..//types/common";
import { PortDataType } from "../..//scaffold/Port";
import { Rect, Text, Circle, Group } from "@antv/react-g";
import Button from "../../common/Button";
import Interactor from "../../scaffold/Interactor";
import Node from "../Node";
import { NodeDataType } from "../Node";
import React from "react";

const { Port } = Interactor;

type CommonPortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
};

type CommonNodeDataType = {
  ports?: CommonPortDataType[];
  fields?: FieldType[];
  x?: number;
  y?: number;
  label?: string;
} & NodeDataType;

const WIDTH = 200;
const HEADER_HEIGHT = 40;
const SINGLE_PORT_HEIGHT = 30;
const HEADER_MARGIN = 20;
const PORT_RADIUS = 10;
const TEXT_WIDTH = 70;
const PORT_TEXT_MARGIN = 10;
const BOTTOM_PADDING = 10;

const PORTS_OFFSET = HEADER_HEIGHT + HEADER_MARGIN;
const PORT_OFFSET = PORTS_OFFSET + SINGLE_PORT_HEIGHT / 2;
const PORT_GRAPHIC_OFFSET =
  PORT_RADIUS + (SINGLE_PORT_HEIGHT - PORT_RADIUS * 2) / 2;

class CommonNode extends Node<CommonNodeDataType, {}> {
  static metaData = {
    fields: [{}],
    label: "",
  };

  static getBounds() {
    return {
      width: 200,
      height: 100,
    };
  }

  getStroke = () => {
    const isSelect = this.isSelect();
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  content() {
    const { color } = this.context;
    const { label, ports } = this.props.data;

    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    const FULL_HEIGHT = CommonNode.getBounds().height;

    const { data } = this.props;

    return (
      <Interactor {...this.props.data} topOnFocus={false}>
        <Rect
          width={WIDTH}
          height={FULL_HEIGHT}
          fill="white"
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={10}
          radius={10}
        />

        {/* out的port */}
        {outPorts.map((portData, index) => (
          <Group
            x={WIDTH - TEXT_WIDTH - PORT_TEXT_MARGIN - PORT_RADIUS}
            y={index * SINGLE_PORT_HEIGHT}
            key={portData.label}
          >
            <Text
              text={portData.label}
              textAlign="right"
              // height={SINGLE_PORT_HEIGHT}
              textBaseline="middle"
            ></Text>
            <Port
              data={portData}
              anchor={() => ({
                x: data.x + WIDTH,
                y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
              })}
            >
              <Circle
                stroke={color.primary}
                fill="white"
                x={TEXT_WIDTH + PORT_RADIUS + PORT_TEXT_MARGIN}
                y={PORT_GRAPHIC_OFFSET}
                r={PORT_RADIUS}
              ></Circle>
            </Port>
          </Group>
        ))}
      </Interactor>
    );
  }
}

export default CommonNode;
