import type { FieldType } from "../..//types/common";
import { PortDataType } from "../..//scaffold/Port";
import { Rect, Text, Circle, Group } from "react-konva";
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

  static getBounds(cellData) {
    const outPorts =
      cellData.ports?.filter((portData) => portData.portType === "out") || [];

    const inPorts =
      cellData.ports?.filter((portData) => portData.portType === "in") || [];

    const controlOutPorts =
      cellData.ports?.filter(
        (portData) => portData.portType === "control-out"
      ) || [];

    const controlInPorts =
      cellData.ports?.filter(
        (portData) => portData.portType === "control-in"
      ) || [];

    const height =
      Math.max(
        outPorts.length + controlOutPorts.length,
        inPorts.length + controlInPorts.length
      ) *
        SINGLE_PORT_HEIGHT +
      HEADER_HEIGHT +
      HEADER_MARGIN +
      BOTTOM_PADDING;
    const width = WIDTH;
    const x = cellData.x - PORT_RADIUS * 0.5;
    const y = cellData.y;

    return {
      width,
      height,
      x,
      y,
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
    const { getStroke } = this;
    const { label, ports } = this.props.data;

    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];

    const controlOutPorts =
      ports?.filter((portData) => portData.portType === "control-out") || [];

    const controlInPorts =
      ports?.filter((portData) => portData.portType === "control-in") || [];

    const FULL_HEIGHT = CommonNode.getBounds(this.props.data).height;

    const { data } = this.props;

    return (
      <Interactor {...this.props.data} topOnFocus={false}>
        <Rect
          width={WIDTH}
          height={FULL_HEIGHT}
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
            height={HEADER_HEIGHT}
            fill={color.grey}
          />
          <Text
            fontSize={14}
            text={label}
            height={HEADER_HEIGHT}
            x={20}
            verticalAlign="middle"
          ></Text>
          <Button
            x={WIDTH}
            width={20}
            height={HEADER_HEIGHT}
            text="＋"
            onClick={(e) => {
              const id = this.context.addCell("CommonNode", {
                x: this.props.data.x + 300,
                y: this.props.data.y,
                label: "new node",
                ports: [
                  {
                    label: "new",
                    portType: "in",
                  },
                ],
              });

              // this.context.sendEvent({
              //   type: "chore",
              //   data: `cell [${id}] has been added`,
              // });
            }}
          />
        </Group>

        {/* // border */}
        <Rect
          width={WIDTH}
          height={FULL_HEIGHT}
          {...getStroke()}
          cornerRadius={10}
        />

        <Group y={PORTS_OFFSET}>
          {/* in的port */}
          {inPorts.map((portData, index) => (
            <Group x={0} y={index * SINGLE_PORT_HEIGHT} key={portData.label}>
              <Port
                data={portData}
                // anchor={() => ({
                //   x: data.x,
                //   y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                // })}
              >
                <Circle
                  stroke={color.primary}
                  fill="white"
                  radius={PORT_RADIUS}
                  y={PORT_GRAPHIC_OFFSET}
                ></Circle>
              </Port>
              <Text
                x={PORT_RADIUS + PORT_TEXT_MARGIN}
                height={SINGLE_PORT_HEIGHT}
                verticalAlign="middle"
                text={portData.label}
              ></Text>
            </Group>
          ))}
          {/* control-in的port */}
          {controlInPorts.map((portData, index) => (
            <Group
              y={(inPorts.length + index) * SINGLE_PORT_HEIGHT}
              key={portData.label}
            >
              <Port
                data={portData}
                anchor={() => ({
                  x: data.x,
                  y:
                    data.y +
                    PORT_OFFSET +
                    (inPorts.length + index) * SINGLE_PORT_HEIGHT,
                })}
              >
                <Rect
                  fill={color.primary}
                  x={-PORT_RADIUS}
                  y={PORT_GRAPHIC_OFFSET - PORT_RADIUS}
                  width={PORT_RADIUS * 2}
                  height={PORT_RADIUS * 2}
                ></Rect>
              </Port>
              <Text
                x={PORT_RADIUS + PORT_TEXT_MARGIN}
                height={SINGLE_PORT_HEIGHT}
                verticalAlign="middle"
                text={portData.label}
              ></Text>
            </Group>
          ))}

          {/* out的port */}
          {outPorts.map((portData, index) => (
            <Group
              x={WIDTH - TEXT_WIDTH - PORT_TEXT_MARGIN - PORT_RADIUS}
              y={index * SINGLE_PORT_HEIGHT}
              key={portData.label}
            >
              <Text
                text={portData.label}
                align="right"
                height={SINGLE_PORT_HEIGHT}
                verticalAlign="middle"
                width={TEXT_WIDTH}
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
                  radius={PORT_RADIUS}
                ></Circle>
              </Port>
            </Group>
          ))}
          {/* control-out的port */}
          {controlOutPorts.map((portData, index) => (
            <Group
              x={WIDTH - TEXT_WIDTH - PORT_RADIUS - PORT_TEXT_MARGIN}
              y={(outPorts.length + index) * SINGLE_PORT_HEIGHT}
              key={portData.label}
            >
              <Text
                text={portData.label}
                align="right"
                height={SINGLE_PORT_HEIGHT}
                verticalAlign="middle"
                width={TEXT_WIDTH}
              ></Text>
              <Port
                data={portData}
                anchor={() => ({
                  x: data.x + WIDTH,
                  y:
                    data.y +
                    PORT_OFFSET +
                    (outPorts.length + index) * SINGLE_PORT_HEIGHT,
                })}
              >
                <Rect
                  fill={color.primary}
                  x={TEXT_WIDTH + PORT_TEXT_MARGIN}
                  y={PORT_GRAPHIC_OFFSET - PORT_RADIUS}
                  width={PORT_RADIUS * 2}
                  height={PORT_RADIUS * 2}
                ></Rect>
              </Port>
            </Group>
          ))}
        </Group>
      </Interactor>
    );
  }
}

export default CommonNode;
