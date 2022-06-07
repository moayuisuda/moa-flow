import {
  NodePropsType,
  PortDataType,
  Interactor,
  Graph,
  Content,
  useEvent,
  useModel,
} from "@ali/flow-infra-g";

const { Rect, Text, Circle } = Graph;

type FuncNodeDataType = {
  label: string;
  ports: PortDataType[];
};

const FuncNode = (props: NodePropsType<FuncNodeDataType>) => {
  const context = useModel();
  const { data } = props;
  const portData = data.ports[0];

  useEvent((e: any) => {
    console.log("node-event", { e });
  }, data.id);

  return (
    <Content {...props}>
      <Interactor {...props.data}>
        <Rect
          width={200}
          height={120}
          fill="white"
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={10}
          radius={10}
        />
        <Rect width={200} height={120} fill={"rgba(0,0,0,.5)"} radius={10} />
        <Text
          x={10}
          y={10}
          fontWeight="bold"
          textBaseline={"top"}
          text={data.label || ""}
          fill="white"
        />
        <Text
          x={20}
          y={60}
          text={"连接nodes: " + JSON.stringify(context.getLinkNodes(data.id))}
        />
        <Text
          x={20}
          y={90}
          text={"连接ports: " + JSON.stringify(context.getLinkPorts(data.id))}
        />
      </Interactor>

      <Interactor.Port
        data={data.ports[0]}
        key={portData}
        anchor={{
          x: data.x,
          y: data.y,
        }}
      >
        <Circle lineWidth={4} stroke={"red"} fill="white" r={10}></Circle>
      </Interactor.Port>
    </Content>
  );
};

export default FuncNode;
