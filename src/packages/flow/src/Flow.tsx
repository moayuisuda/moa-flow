import { Stage, Layer, Group } from "react-konva";
import React from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
// 初始化model并注册所有组件

@observer
class Flow extends React.Component<
  { canvasData: any; onEvent: (e: any) => void },
  {}
> {
  eventBus;
  flowModel;

  constructor(props: { canvasData: string; onEvent: (e: any) => void }) {
    super(props);

    this.flowModel = new FlowModel(props.onEvent);
    this.flowModel.setCanvasData(this.props.canvasData);

    registComponents(this.flowModel);
  }

  renderComponent(cellData) {
    return React.createElement(
      this.flowModel.componentsMap.get(cellData.component),
      {
        ...cellData,
        key: cellData.id,
      }
    );
  }

  renderComponents = (cellsData) => {
    const { flowModel: model } = this;

    return (
      <Layer>
        <Group>
          {cellsData
            // 先渲染注册节点，后渲染注册线
            .filter((cellData) => cellData.type !== "edge")
            .map((cellData) => {
              // 这里顺便生成cellsDataMap
              model.cellsDataMap.set(cellData.id, cellData);
              return this.renderComponent(cellData);
            })}
        </Group>
        <Group>
          {cellsData
            .filter((cellData) => cellData.type === "edge")
            .map((cellData) => {
              this.renderComponent(cellData);
              model.cellsDataMap.set(cellData.id, cellData);
              return this.renderComponent(cellData);
            })}
        </Group>
      </Layer>
    );
  };

  render() {
    const { canvasData } = this.flowModel;
    const { renderComponents } = this;
    // debugger;

    return (
      // Provider不能放在最外层，见issue：https://github.com/facebook/react/issues/12796
      <Stage
        scale={canvasData.scale}
        x={canvasData.x}
        y={canvasData.y}
        draggable={true}
        onDragEnd={(e) => {
          this.flowModel.setStagePosition(
            e.currentTarget.attrs.x,
            e.currentTarget.attrs.y
          );
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <FlowContext.Provider
          value={{
            model: this.flowModel,
          }}
        >
          {renderComponents(canvasData.cells)}
        </FlowContext.Provider>
      </Stage>
    );
  }
}

export default Flow;
