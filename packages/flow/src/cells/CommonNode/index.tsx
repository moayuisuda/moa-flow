import { Interactor, PortDataType } from "../../components";
import { Rect, Text, Circle } from "@antv/react-g";
import Node, { NodeDataType } from "../Node";
import React from "react";

const { Port } = Interactor;

type CommonPortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
};

type CommonNodeDataType = {
  ports?: CommonPortDataType[];
  x?: number;
  y?: number;
  label?: string;
} & NodeDataType;
class CommonNode extends Node<CommonNodeDataType, {}> {
  static metaData = {
    label: "",
  };

  static getBounds(cellData: NodeDataType) {
    return {
      x: cellData.x,
      y: cellData.y,
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
        lineWidth: 3,
      };
    } else
      return {
        stroke: undefined,
        lineWidth: 0,
      };
  };

  content() {
    const { color } = this.context;
    const { data } = this.props;
    const { label, ports } = data;
    const { width, height } = CommonNode.getBounds(data);

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];
    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    return (
      <Interactor {...this.props.data}>
        <Rect
          width={width}
          height={height}
          fill="white"
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={10}
          radius={10}
          {...this.getStroke()}
        />

        <Rect width={width} height={40} fill={color.deepGrey} radius={10} />

        <Text
          x={10}
          y={10}
          fontWeight="bold"
          textBaseline={"top"}
          text={label}
          fill="white"
        />

        {/* out的port */}
        {inPorts.map((portData) => (
          <Port
            y={70}
            data={portData}
            key={portData.label}
            anchor={{
              x: data.x - 20,
              y: data.y + 70,
            }}
          >
            <Circle
              lineWidth={4}
              stroke={color.primary}
              fill="white"
              r={10}
            ></Circle>
          </Port>
        ))}

        {/* out的port */}
        {outPorts.map((portData) => (
          <Port
            x={width}
            y={70}
            data={portData}
            key={portData.label}
            anchor={{
              x: data.x + width + 20,
              y: data.y + 70,
            }}
          >
            <Circle
              lineWidth={4}
              stroke={color.primary}
              fill="white"
              r={10}
            ></Circle>
          </Port>
        ))}
      </Interactor>
    );
  }
}

export default CommonNode;
