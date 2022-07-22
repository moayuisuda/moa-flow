import { Port, NodeModel, FlowContext, observer } from "@ali/flow-infra-g";
import type {
  ModelType,
  NodeData,
  PortData,
  PortDataType,
} from "@ali/flow-infra-g";
import { message } from "antd";
import { useContext } from "react";
import { useObserver } from "mobx-react";

export type BasePortDataType = PortData<{
  label: string;
  portType: "in" | "out";
}>;

export type BaseNodeData = NodeData<{
  ports: BasePortDataType[];
}>;

export enum STATUS_ENUM {
  WAIT,
  PROCESS,
  SUCCESS,
  ERROR,
}

const BaseNode: React.FC<{
  model: NodeModel<BaseNodeData>;
}> = observer(({ model }) => {
  const context = useContext(FlowContext);
  const isSelect = model.isSelect;
  const { color } = context;
  const { data } = model;
  const { title, ports, width, height } = data;

  console.log(model);

  const outPorts =
    ports?.filter((portData) => portData.portType === "out") || [];

  return (
    <div
      style={{
        width,
        height,
        borderColor: isSelect ? color.active : color.deepGrey,
        borderStyle: "solid",
        borderWidth: "2px",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <h1>{`${title} [${STATUS_ENUM[data.status]}]`}</h1>

      {outPorts.map((portData: PortDataType) => (
        <Port
          key={portData.id}
          data={portData}
          anchor={() => ({
            x: data.x + 20,
            y: data.y + 80,
          })}
          link={(target: PortDataType, source: PortDataType) => {
            return true;
          }}
        >
          Port
        </Port>
      ))}
    </div>
  );
});

export default BaseNode;
