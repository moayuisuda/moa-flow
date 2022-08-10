import {
  ModelType,
  NodeData,
  PortData,
  NodeModel,
  PortDataType,
  Port,
  observer,
} from "@ali/flow-infra-g";
import { Card, CardProps, message } from "antd";
import { HANG_FLAG } from "../constants";

export type BasePortDataType = PortData<{
  label: string;
  portType: "in" | "out";
}>;

export enum STATUS_ENUM {
  WAIT,
  PROCESS,

  SUCCESS,
  ERROR,
  HANG,
}

export type BaseNodeDataType = NodeData<{
  ports: BasePortDataType[];
  cacheData: any;
  status: STATUS_ENUM;
}>;

export class BaseNodeModel<D = {}> extends NodeModel<BaseNodeDataType & D> {
  static defaultData: any = {
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
    x: 0,
    y: 0,
    id: "",
    component: "",
    cellType: "node",
  };

  constructor(props: { data: BaseNodeDataType }, context: ModelType) {
    super(props, context);
  }

  // 怎样处理数据，并作用在自己的cacheData，返回的都是promise
  excute = async () => {
    return this.data.cacheData;
  };

  checkHang = () => {
    // 如果所有连接的结点都是hang的，那当前的结点也hang
    let isAllPreHang = true;
    const inNodes = this.getInNodes();
    if (inNodes.length === 0) return false;

    inNodes.forEach((id) => {
      const output = (this.context.getCellModel(id) as BaseNodeModel).output();
      if (output !== HANG_FLAG) isAllPreHang = false;
    });

    return isAllPreHang;
  };

  // 执行前置依赖节点
  processPreNode = (start?: string) => {
    const data = this.data;
    const inPortData = data.ports.find(
      (portData) => portData.portType === "in"
    ) as BasePortDataType;

    const linkNodes = this.context
      .getPortLinkNodes(inPortData.id)
      .map((id) => this.context.getCellData(id)) as BaseNodeDataType[];

    return Promise.all(
      linkNodes.map((linkNodeData) => {
        const model = this.context.getCellModel(linkNodeData.id) as BaseNodeModel;
        return model.process(start);
      })
    );
  };

  onTaksError(e: any) {
    message.error(`[${this.data.title}] ${e}`);
    console.error(e);
  }

  // 单个节点的task
  task = async (start?: string) => {
    const { taskPool } = this.context.extra;

    try {
      if (start !== this.data.id) await this.processPreNode(start);
      this.setData({
        status: STATUS_ENUM.PROCESS,
      });

      // 如果这个结点本身已经从前置节点推导为hang结点，就不excute了
      const isHang = this.checkHang();
      if (isHang) {
        this.setData({
          status: STATUS_ENUM.HANG,
        });
        this.setData({ cacheData: HANG_FLAG });
        return;
      }

      const resData = await this.excute();
      this.setData({ cacheData: resData }, false);

      if (resData === HANG_FLAG) {
        this.setData({
          status: STATUS_ENUM.HANG,
        });
        return;
      }
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
      taskPool[this.data.id] = undefined;
    }
  };

  output() {
    return this.data.cacheData;
  }

  getInNodes() {
    const data = this.data;
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
    if (taskPool[this.data.id]) return taskPool[this.data.id];

    const taskPromise = this.task(start);

    taskPool[this.data.id] = taskPromise;
    return taskPromise;
  };

  getStroke() {
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
  }

  getFill() {
    const color = this.context.color;

    const fillMap = {
      [STATUS_ENUM.WAIT]: "white",
      [STATUS_ENUM.PROCESS]: color.grey,
      [STATUS_ENUM.ERROR]: color.error,
      [STATUS_ENUM.SUCCESS]: color.success,
      [STATUS_ENUM.HANG]: color.deepGrey,
    };

    return { fill: fillMap[this.data.status] };
  }
}

export const NodeFrame: React.FC<
  {
    model: BaseNodeModel;
  } & CardProps
> = observer(({ model, children, ...others }) => {
  const { color } = model.context;
  const { data, isSelect } = model;
  const { title, ports, x, y } = data;

  const inPorts = ports?.filter((portData) => portData.portType === "in") || [];
  const outPorts =
    ports?.filter((portData) => portData.portType === "out") || [];

  const portStyleProps: React.CSSProperties = {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    border: "2px solid",
    top: 100,
    borderColor: color.deepGrey,
    backgroundColor: "white",
  };

  const fillMap = {
    [STATUS_ENUM.WAIT]: "white",
    [STATUS_ENUM.PROCESS]: color.grey,
    [STATUS_ENUM.ERROR]: color.error,
    [STATUS_ENUM.SUCCESS]: color.success,
    [STATUS_ENUM.HANG]: color.deepGrey,
  };

  return (
    <Card
      title={title}
      style={{
        // 防止border造成位置错位，所以该用outline
        border: 'none',
        outlineColor: isSelect ? color.active : color.deepGrey,
        outlineWidth: 2,
        outlineStyle: "solid",
        width: 300,
      }}
      headStyle={{
        backgroundColor: fillMap[data.status]
      }}
      {...others}
    >
      {children}

      {inPorts.map((portData: PortDataType) => (
        <Port
          key={portData.id}
          data={portData}
          anchor={{
            x: x - 15,
            y: y + 110,
          }}
          link={(target: PortDataType, source: PortDataType) => {
            return true;
          }}
        >
          <div style={{ ...portStyleProps, left: -10 }}></div>
        </Port>
      ))}
      {outPorts.map((portData: PortDataType) => (
        <Port
          key={portData.id}
          data={portData}
          anchor={{
            x: x + 310,
            y: y + 110,
          }}
        >
          <div
            style={{
              ...portStyleProps,
              right: -10,
            }}
          ></div>
        </Port>
      ))}
    </Card>
  );
});
