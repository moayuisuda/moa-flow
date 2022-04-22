import { Interactor, Node, Html, Graph } from "@ali/flow-infra";
import type { PortDataType } from "@ali/flow-infra";
import { message, Modal } from "antd";
const { Rect, Text, Circle, Group } = Graph;

interface MyPortDataType extends PortDataType {
  label: string;
}

type MyNodeDataType = {
  label?: string;
} & PortDataType;

const WIDTH = 300;
const HEIGHT = 160;

class MyNode extends Node<MyNodeDataType, {}> {
  // metaData决定了新增节点时的初始数据，会merge父类的metaData
  static metaData = {
    fields: [{}],
    label: "",
  };

  getStroke = () => {
    const isSelect = this.context.selectCells.includes(this.props.data.id);

    if (isSelect) {
      return {
        stroke: "#0cbb52",
      };
    } else return {};
  };

  // 只有这个方法是必要的，可以理解为包装后的render，基类已经做了observer处理，会自动收集依赖
  content() {
    const { getStroke } = this;

    return (
      // 这个组件提供交互能力，可以手动设置draggable（可拖拽），selectable（可被选择）
      <Interactor {...this.props.data}>
        <Rect
          width={WIDTH}
          height={HEIGHT}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.1}
          cornerRadius={10}
        />

        <Group>
          <Rect
            cornerRadius={[10, 10, 0, 0]}
            width={WIDTH}
            height={40}
            fill="rgb(255, 108, 55)"
          />
          <Text
            fontSize={14}
            text="一个只能连接father桩的节点"
            height={40}
            x={20}
            verticalAlign="middle"
          ></Text>
        </Group>

        {/* // border */}
        <Rect
          width={WIDTH}
          height={HEIGHT}
          {...getStroke()}
          cornerRadius={10}
        />

        <Group y={40}>
          {this.props.data.ports?.map((portData, index) => (
            <Interactor.Port
              key={index}
              x={WIDTH - 50}
              y={20 + index * 30}
              link={(source: MyPortDataType, target: MyPortDataType) => {
                const adopt =
                  target.label === "father" || source.label === "father";
                if (!adopt) message.warn("我只能链接father桩");

                return adopt;
              }}
              data={portData}
            >
              <Circle
                stroke={"#0cbb52"}
                fill="white"
                y={6}
                x={50}
                radius={10}
              ></Circle>
            </Interactor.Port>
          ))}
        </Group>
        <Html>{/* <Modal visible={true}>hello</Modal> */}</Html>
      </Interactor>
    );
  }
}

export default MyNode;
