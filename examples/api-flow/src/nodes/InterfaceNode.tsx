import type { ModelType } from "@ali/flow-infra-g";
import { ConsumerBridge, Graph, Portal } from "@ali/flow-infra-g";
import { Modal } from "antd";
import { Context } from "../Context";
import NodeInfoSettingDrawer from "../NodeConfigForm";
import { FlowNodeConfig } from "../types";
import BaseNode, { BaseNodeDataType } from "./BaseNode";

const { Rect, Text, Circle, Image, Group } = Graph;

export type InterfaceNodeDataType = BaseNodeDataType & FlowNodeConfig;

class InterfaceNode extends BaseNode<
  InterfaceNodeDataType,
  { modalVisible: boolean }
> {
  static metaData = {
    interface: "",
    inputParams: [],
    type: "",
  };

  static getBounds(cellData: InterfaceNodeDataType) {
    return {
      x: cellData.x,
      y: cellData.y,
      width: 200,
      height: 100,
    };
  }

  constructor(props: { data: InterfaceNodeDataType }, context: ModelType) {
    super(props, context);

    this.state = {
      modalVisible: false,
    };
  }

  // 执行实际的接口请求
  excute = () => {
    const data = this.props.data;

    return fetch(this.getUrl(data.interface), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.getParams()),
    });
  };

  // @TODO 把inputParams转化为接口的参数
  getParams() {
    const re = {} as {
      [key: string]: any;
    };

    const inputParams = this.getData().inputParams;
    inputParams.forEach((param) => {
      if (param.assignmentType === "variable") {
        const nodeData = this.context.getCellData(
          param.value
        ) as InterfaceNodeDataType;
        re[param.id] = nodeData.cacheData;
      } else re[param.id] = param.value;
    });

    return re;
  }

  // @TODO 转化为真实url
  getUrl(interfaceArr: string[]) {
    return "https://c7201052-b5c3-4023-a628-ad23c75a7819.mock.pstmn.io/test1";
  }

  view() {
    const { data } = this.props;
    const { width } = InterfaceNode.getBounds(data);

    const position = this.getPosition();

    return (
      <ConsumerBridge context={Context}>
        {(InterfaceContext) => (
          <Group>
            <Text
              x={20}
              y={70}
              textBaseline="middle"
              text={"status: " + this.state.status}
            />

            <Portal>
              <Modal
                destroyOnClose
                visible={this.state.modalVisible}
                width={800}
                onCancel={() => {
                  this.setState({
                    modalVisible: false,
                  });
                }}
              >
                <NodeInfoSettingDrawer
                  id={data.id}
                  interfaceSchema={InterfaceContext.interfaceSchema}
                />
              </Modal>
            </Portal>

            <Group
              // @ts-ignore
              x={width}
              cursor="pointer"
              onClick={() => this.setState({ modalVisible: true })}
            >
              <Rect
                width={40}
                height={40}
                radius={[0, 4, 4, 0]}
                fill={this.context.color.active}
              ></Rect>
              <Text
                y={20}
                x={6}
                textBaseline="middle"
                fill="white"
                text={"Edit"}
                fontSize={12}
              />
            </Group>
          </Group>
        )}
      </ConsumerBridge>
    );
  }
}

export default InterfaceNode;
