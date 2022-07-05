import type { ModelType, NodeDataType, PortDataType } from "@ali/flow-infra-g";
import { ConsumerBridge, Graph, Interactor, Node } from "@ali/flow-infra-g";
import { message } from "antd";
import { Context } from "../Context";

const { Rect, Text, Circle, Group } = Graph;
const { Port } = Interactor;

export type BasePortDataType = PortDataType & {
  label: string;
  portType: "in" | "out";
};

export enum STATUS_ENUM {
  WAIT,
  PROCESS,
  SUCCESS,
  ERROR,
}

export type BaseNodeDataType = {
  ports: BasePortDataType[];
  cacheData: any;
  status: STATUS_ENUM;
} & NodeDataType;

class BaseNode<Data = {}, State = {}> extends Node<
  BaseNodeDataType & Data,
  State
> {
  static metaData: any = {
    title: "",
    type: "",
    cacheData: undefined,
    status: STATUS_ENUM.WAIT,
    ports: [
      {
        portType: "in",
      },
      {
        portType: "out",
      },
    ],
  };

  width: number = 220;
  height: number = 100;

  constructor(props: { data: BaseNodeDataType }, context: ModelType) {
    super(props, context);
  }

  // 怎样处理数据，并作用在自己的cacheData，返回的都是promise
  excute = async () => {
    return this.props.data.cacheData;
  };

  // 执行前置依赖节点
  processPreNode = (start?: string) => {
    const data = this.props.data;
    const inPortData = data.ports.find(
      (portData) => portData.portType === "in"
    ) as BasePortDataType;

    const linkNodes = this.context
      .getPortLinkNodes(inPortData.id)
      .map((id) => this.context.getCellData(id)) as BaseNodeDataType[];

    return Promise.all(
      linkNodes.map((linkNodeData) => {
        const instance = this.context.getCellInstance(linkNodeData.id);
        return instance.process(start);
      })
    );
  };

  onTaksError(e: any) {
    message.error(`[${this.props.data.title}] ${e}`);
    console.error(e);
  }

  // 单个节点的task
  task = async (start?: string) => {
    const { taskPool } = this.context.extra;

    try {
      if (start !== this.props.data.id) await this.processPreNode(start);
      this.setData({
        status: STATUS_ENUM.PROCESS,
      });
      const resData = await this.excute();
      this.setData({ cacheData: resData }, false);
      this.setData({
        status: STATUS_ENUM.SUCCESS,
      });
    } catch (e) {
      this.setData({
        status: STATUS_ENUM.ERROR,
      });
      this.onTaksError(e);

      return Promise.reject(e);
    } finally {
      taskPool[this.getData().id] = undefined;
    }
  };

  output() {
    return this.getData().cacheData;
  }

  getInNodes() {
    const data = this.props.data;
    const { ports } = data;

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];

    const nodesId = this.context.getPortLinkNodes(inPorts[0].id);

    return nodesId;
  }

  // task的上层包装，用来注册task和返回已有的task
  process = async (start?: string) => {
    // 如果task池已经有在执行的相同task，就直接返回有的
    const { taskPool } = this.context.extra;
    if (taskPool[this.getData().id]) return taskPool[this.getData().id];

    const taskPromise = this.task(start);

    taskPool[this.getData().id] = taskPromise;
    return taskPromise;
  };

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
      [STATUS_ENUM.WAIT]: "white",
      [STATUS_ENUM.PROCESS]: color.grey,
      [STATUS_ENUM.ERROR]: color.error,
      [STATUS_ENUM.SUCCESS]: color.success,
    };

    return { fill: fillMap[this.props.data.status] };
  }

  view() {
    return <></>;
  }

  // 只有这个方法是必须的
  content() {
    const { color } = this.context;
    const { data } = this.props;
    const { title, ports } = data;
    const { width, height } = this;

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];
    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    const position = this.getPosition();

    return (
      <ConsumerBridge context={Context}>
        {(bizContext) => (
          <Interactor {...this.props.data}>
            <Rect
              width={width}
              height={height}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={10}
              radius={[10, 0, 10, 10]}
              {...this.getFill()}
              {...this.getStroke()}
            />
            <Rect
              width={width}
              height={40}
              fill={color.deepGrey}
              radius={[10, 0, 0, 0]}
            />
            <Text
              x={10}
              y={20}
              fontWeight="bold"
              textBaseline="middle"
              text={`${title} [${STATUS_ENUM[data.status]}]`}
              fill="white"
            />

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
              // @ts-ignore
              <Group x={width} y={70} key={portData.id}>
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

            {this.view()}
          </Interactor>
        )}
      </ConsumerBridge>
    );
  }
}

export default BaseNode;
