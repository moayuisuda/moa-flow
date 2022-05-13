import React from "react";
import {
  Node,
  Graph,
  Interactor,
  ModelType,
  PortDataType,
  NodeDataType,
  Portal,
  ConsumerBridge,
} from "@ali/flow-infra-g";
import { message, Input, Modal } from "antd";
import BizContext from "./Context";

const { Rect, Text, Circle, Arrow } = Graph;
const { Port } = Interactor;

type BizPortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
};

type BizNodeDataType = {
  ports?: BizPortDataType[];
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

  // 只有这个方法是必须的
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
      <ConsumerBridge context={BizContext}>
        {(bizContext) => (
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
              text={(label || "") + bizContext.count}
              fill="white"
            />

            <Text
              x={20}
              y={60}
              text={"连接nodes: " + JSON.stringify(this.getLinkNodes())}
            />
            <Text
              x={20}
              y={90}
              text={"连接ports: " + JSON.stringify(this.getLinkPorts())}
            />
            {/* 也可以用this.context.getPortLinkPorts/this.context.getPortLinkNodes，根据port来定义节点 */}

            <Portal y={100}>
              <Input value={bizContext.count} style={{ width: 200 }}></Input>
              {/* <Modal
                visible={this.state.modalVisible}
                onCancel={() => this.setState({ modalVisible: false })}
              ></Modal> */}
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
        )}
      </ConsumerBridge>
    );
  }
}

export default BizNode;
