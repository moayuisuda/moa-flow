import React from "react";
import {
  Node,
  Graph,
  Interactor,
  Portal,
  ConsumerBridge,
} from "@ali/flow-infra-g";
import type { ModelType, PortDataType, NodeDataType } from "@ali/flow-infra-g";
import { message, Input, Modal } from "antd";
import BizContext from "./Context";

const { Rect, Text, Circle, Image, Group } = Graph;
const { Port } = Interactor;

export type BizPortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
  fold?: boolean;
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
      modalVisible: false,
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

            <Portal y={100}>
              <Input value={bizContext.count} style={{ width: 200 }}></Input>
              <Modal
                visible={this.state.modalVisible}
                onCancel={() => this.setState({ modalVisible: false })}
              ></Modal>
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
              <Group x={width} y={70} key={portData.id}>
                <Text
                  cursor="pointer"
                  fill={this.context.color.active}
                  textBaseline="middle"
                  x={-50}
                  text={portData.fold ? "展开" : "收起"}
                  // 防止冒泡触发默认的选中事件
                  onMousedown={(e) => e.stopPropagation()}
                  onClick={() => {
                    const linkedNodes = this.context.getPortLinkNodes(
                      portData.id
                    );
                    const edges = portData.edges as string[];

                    linkedNodes.concat(edges).forEach((cellId) => {
                      this.context.setCellData(cellId, {
                        visible: portData.fold,
                      });
                    });

                    this.context.setCellData(portData.id, {
                      fold: !portData.fold,
                    });
                  }}
                />

                <Port
                  data={portData}
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
              </Group>
            ))}

            <Image
              x={width}
              width={20}
              height={20}
              img={require("./img.png")}
              onClick={() => this.setState({ modalVisible: true })}
            ></Image>
          </Interactor>
        )}
      </ConsumerBridge>
    );
  }
}

export default BizNode;
