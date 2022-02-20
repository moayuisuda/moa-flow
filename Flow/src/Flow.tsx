import { Stage, Layer } from "react-konva";
import React from "react";
import MatrixNode from "./nodes/Matrix/MatrixNode";
import { action, observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import { FlowContext } from "./Context";
import { v4 } from "uuid";
import Inspector from "./nodes/Inspector";

export class FlowModel {
  constructor() {
    makeObservable(this);
  }

  // cell的<id, 实例>map，方便用id获取到实例
  cellsMap = {};

  // 注册节点到model，方便动态引用
  componentsMap = {};

  // 注册组件，自定义组件在这里注册后，json也能根据component字段来对应调用
  regisCells = () => {
    MatrixNode.registComponent(this);
    Inspector.registComponent(this);
  };

  // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
  @observable canvasData = [];

  @action setCanvasData = (canvasData) => {
    this.canvasData = canvasData;
  };

  @action setCellData = (id, data) => {
    const cellData = this.getCellData(id);

    Object.assign(cellData, {
      ...data,
    });
  };

  // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
  @action setAutoLayout = (layoutOption) => {};

  // test
  @action addNode = () => {
    const id = v4();
    this.canvasData = this.canvasData.concat([
      {
        id,
        type: "node",
        ports: [],
        fields: [
          {
            label: "age",
            port: {},
          },
        ],
        x: 0,
        y: 0,
      },
    ]);
  };

  getCellData = (id) => {
    return this.canvasData.find((cellData) => {
      return cellData.id === id;
    });
  };

  // 将这几个方法暴露出去，方便业务调用
  onConnect(data) {}

  onClick(data) {}

  onDele(data) {}
}

const flowModel = new FlowModel();
flowModel.regisCells();

@observer
class Flow extends React.Component<{ canvasData: any }, { canvasData: any }> {
  constructor(props: { canvasData: string }) {
    super(props);

    flowModel.setCanvasData(this.props.canvasData);
  }

  renderComponents(canvasData) {
    return (
      <Layer>
        {/* // 先渲染注册节点，后渲染注册线 */}
        {canvasData
          .filter((cellData) => cellData.type !== "edge")
          .map((cellData) =>
            React.createElement(flowModel.componentsMap[cellData.component])
          )}

        {canvasData
          .filter((cellData) => cellData.type === "edge")
          .map((cellData) =>
            React.createElement(flowModel.componentsMap[cellData.component])
          )}
      </Layer>
    );
  }

  render() {
    const { canvasData } = flowModel;
    const { renderComponents } = this;

    return (
      // Provider不能放在最外层，见issue：https://github.com/facebook/react/issues/12796
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <FlowContext.Provider
          value={{
            model: flowModel,
          }}
        >
          {renderComponents(canvasData)}
        </FlowContext.Provider>
      </Stage>
    );
  }
}

export default Flow;
