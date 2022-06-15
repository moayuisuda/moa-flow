import type { ModelType, NodeDataType, PortDataType } from "@ali/flow-infra-g";
import {
  ConsumerBridge,
  Graph,
  Interactor,
  Node,
  Portal,
} from "@ali/flow-infra-g";
import { Modal } from "antd";
import { Context } from "./Context";
import NodeInfoSettingDrawer from "./NodeConfigForm";
import { FlowNodeConfig } from "./types";

const { Rect, Text, Circle, Image, Group } = Graph;
const { Port } = Interactor;

export type InterfacePortDataType = PortDataType & {
  label: string;
  portType: "in" | "out" | "control-out" | "control-in";
  fold?: boolean;
  InterfaceData: any;
  api: string;
  apiType: "";
};

export type InterfaceNodeDataType = {
  ports: InterfacePortDataType[];
} & NodeDataType &
  FlowNodeConfig;

class InterfaceNode extends Node<
  InterfaceNodeDataType,
  { modalVisible: boolean; status: "success" | "process" | "error" | "wait" }
> {
  static metaData = {
    interface: "",
    inputParams: [],
    title: "",
    type: "",
    cacheData: {},
    ports: [
      {
        portType: "in",
      },
      {
        portType: "out",
      },
    ],
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
      status: "wait",
    };
  }

  excute = () => {
    const data = this.props.data;

    console.log("params", JSON.stringify(this.getParams()));
    return fetch(this.getUrl(data.interface), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.getParams()),
    });
  };

  processPreNode = (start: string) => {
    const data = this.props.data;
    const inPortData = data.ports.find(
      (portData) => portData.portType === "in"
    ) as InterfacePortDataType;

    const linkNodes = this.context
      .getPortLinkNodes(inPortData.id)
      .map((id) => this.context.getCellData(id)) as InterfaceNodeDataType[];

    return Promise.all(
      linkNodes.map((linkNodeData) => {
        const instance = this.context.getCellInstance(linkNodeData.id);
        return instance.process(start);
      })
    );
  };

  process = async (start: string) => {
    // 如果task池子已经有在执行的相同task，就直接返回有的
    const { taskPool } = this.context.extra;
    if (taskPool[this.getData().id]) return taskPool[this.getData().id];

    const task = async () => {
      try {
        if (!(this.props.data.id === start)) await this.processPreNode(start);

        this.setState({
          status: "process",
        });
        const resData = await this.excute().then((res) => res.json());
        this.setData({ cacheData: resData });
        this.setState({
          status: "success",
        });
      } catch (e) {
        console.error(e);
        this.setData({
          status: "error",
        });
      } finally {
        taskPool[this.getData().id] = undefined;
      }
    };

    const taskPromise = task();
    taskPool[this.getData().id] = taskPromise;
    return await taskPromise;
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

  getStroke() {
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
  }

  getFill() {
    const color = this.context.color;

    const fillMap = {
      wait: "white",
      process: color.grey,
      error: color.error,
      success: color.success,
    };

    return { fill: fillMap[this.state.status] };
  }

  // 只有这个方法是必须的
  content() {
    const { color } = this.context;
    const { data } = this.props;
    const { title, ports } = data;
    const { width, height } = InterfaceNode.getBounds(data);

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];
    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    const position = this.getPosition();

    return (
      <ConsumerBridge context={Context}>
        {(InterfaceContext) => (
          <Interactor {...this.props.data}>
            <Rect
              width={width}
              height={height}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={10}
              radius={10}
              {...this.getFill()}
              {...this.getStroke()}
            />
            <Rect
              width={width}
              height={40}
              fill={color.deepGrey}
              radius={[10, 0, 0, 10]}
            />
            <Text
              x={10}
              y={10}
              fontWeight="bold"
              textBaseline={"top"}
              text={title || ""}
              fill="white"
            />
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
                footer={[]}
              >
                <NodeInfoSettingDrawer
                  onSave={() => this.setState({ modalVisible: false })}
                  id={data.id}
                  interfaceSchema={InterfaceContext.interfaceSchema}
                />
              </Modal>
            </Portal>

            {/* in的port */}
            {inPorts.map((portData: PortDataType) => (
              <Port
                y={70}
                data={portData}
                key={portData.label}
                anchor={{
                  x: position.x - 20,
                  y: position.y + 70,
                }}
                link={(target: PortDataType, source: PortDataType) => {
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

            {/* out的port */}
            {outPorts.map((portData: PortDataType) => (
              <Group x={width} y={70} key={portData.id}>
                <Text
                  cursor="pointer"
                  fill={this.context.color.active}
                  textBaseline="middle"
                  x={-50}
                  text={portData.fold ? "展开" : "收起"}
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
                    x: position.x + width + 20,
                    y: position.y + 70,
                  }}
                  link={(target: PortDataType, source: PortDataType) => {
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

            <Group
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
          </Interactor>
        )}
      </ConsumerBridge>
    );
  }
}

export default InterfaceNode;
