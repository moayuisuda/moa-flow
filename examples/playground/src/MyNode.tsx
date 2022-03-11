import { Rect, Text, Circle, Group } from "react-konva";
import { Interactor, Node } from "flow";
import type { PortType } from "flow";

type MyNodeType = {
  ports?: PortType[];
  x: number;
  y: number;
  label?: string;
};

const WIDTH = 300;
const HEIGHT = 160;

class MyNode extends Node<MyNodeType, {}> {
  // metaData决定了新增节点时的初始数据，会merge父类的metaData
  static metaData = {
    fields: [{}],
    label: "",
  };

  getStroke = () => {
    const isSelect = this.context.model.selectCells.includes(
      this.props.data.id
    );

    if (isSelect) {
      return {
        stroke: "#0cbb52",
      };
    } else return {};
  };

  // 只有这个方法是必要的，可以理解为包装后的render，基类已经做了observer处理，会自动收集依赖
  content() {
    const { getStroke } = this;
    const { x, y, label } = this.props.data;

    return (
      // 这个组件提供交互能力，可以手动设置draggable（可拖拽），selectable（可被选择）
      <Interactor {...this.props.data} topOnFocus>
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
            text={this.props.data.id}
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
              linkable={true}
              data={portData}
              // // 默认是以包围盒中心为坐标，可以手动传入port锚点的坐标函数
              // anchor={() => {
              //   return {
              //     x: x + 200,
              //     y: y + 65 + index * 30,
              //   };
              // }}
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
      </Interactor>
    );
  }
}

export default MyNode;
