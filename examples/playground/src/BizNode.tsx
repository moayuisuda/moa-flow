import React from "react";
import {
  Node,
  Graph,
  Interactor,
  ModelType,
  PortDataType,
  NodeDataType,
  Portal,
} from "@ali/moa-flow";
import { message, Input, Modal } from "antd";
const { Rect, Text, Circle, HTML } = Graph;

const { Port } = Interactor;

type CommonPortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
};

type BizNodeDataType = {
  ports?: CommonPortDataType[];
  x?: number;
  y?: number;
  label?: string;
} & NodeDataType;
class BizNode extends Node<BizNodeDataType, { modalVisible: boolean }> {
  static metaData = {
    label: "",
  };

  static getBounds(cellData: BizNodeDataType) {
    return {
      x: cellData.x,
      y: cellData.y,
      width: 200,
      height: 100,
    };
  }

  constructor(props: { data: BizNodeDataType }, context: ModelType) {
    super(props, context);

    this.state = {
      modalVisible: true,
    };
  }

  getStroke = () => {
    const isSelect = this.isSelect;
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

  getLinkData() {
    const linkNodes = this.context.getLinkNodes(this.props.data.id)
    if(linkNodes) return JSON.stringify((this.context.getCellData(linkNodes[0]) as any))
    this.context
  }
  
  content() {
    const { color } = this.context;
    const { data } = this.props;
    const { label, ports } = data;
    const { width, height } = BizNode.getBounds(data);

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
          text={label || ""}
          fill="white"
        />

        <Text text={this.getLinkData()}></Text>

        <Portal y={100}>
          <Input
            onInput={(e) => {
              this.setData({ label: e.target.value });
            }}
            onFocus={e => this.context.extra.alert('hello')}
            style={{ width: 200 }}
          ></Input>
        </Portal>

        {/* in的port */}
        {inPorts.map((portData: PortDataType) => (
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
        {outPorts.map((portData: PortDataType) => (
          <Port
            x={width}
            y={70}
            data={portData}
            key={portData.label}
            anchor={{
              x: data.x + width + 20,
              y: data.y + 70,
            }}
            link={(target: PortDataType, source: PortDataType) => {
              message.info(JSON.stringify(target));
              return true;
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

export default BizNode;
