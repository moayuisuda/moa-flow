import { Port, NodeModel, FlowContext, observer } from "@ali/flow-infra-g";
import type { NodeData, PortData, PortDataType } from "@ali/flow-infra-g";
import { useContext } from "react";

export type BasePortDataType = PortData<{
  label: string;
  portType: "in" | "out";
}>;

export type BaseNodeData = NodeData<{
  ports: BasePortDataType[];
}>;

const BaseNode: React.FC<{
  model: NodeModel<BaseNodeData>;
}> = observer(({ model }) => {
  const context = useContext(FlowContext);
  const { color } = context;
  const { data, isSelect } = model;
  const { title, ports, width, height } = data;

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
      <h1>{`${title}`}</h1>

      {outPorts.map((portData) => (
        <Port
          key={portData.id}
          data={portData}
          anchor={() => ({
            x: data.x + 20,
            y: data.y + 80,
          })}
          link={(source, target) => {
            alert(source);
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
