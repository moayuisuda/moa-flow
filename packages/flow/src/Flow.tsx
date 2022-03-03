import { Stage, Layer, Group, useStrictMode } from "react-konva";
import React from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";

const renderComponent = (cellData, model) => {
  return React.createElement(model.componentsMap.get(cellData.component), {
    ...cellData,
    key: cellData.id,
  });
};

const renderComponents = (cellsData, model) => {
  return (
    <Layer>
      <Group>
        {cellsData
          // 先渲染注册节点，后渲染注册线
          .filter((cellData) => cellData.type !== "edge")
          .map((cellData) => {
            // 这里顺便生成cellsDataMap
            model.cellsDataMap.set(cellData.id, cellData);
            return renderComponent(cellData, model);
          })}
      </Group>
      <Group>
        {cellsData
          .filter((cellData) => cellData.type === "edge")
          .map((cellData) => {
            model.cellsDataMap.set(cellData.id, cellData);
            return renderComponent(cellData, model);
          })}
      </Group>
    </Layer>
  );
};

const Canvas = observer((props) => {
  const { model } = props;

  // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
  useStrictMode(true);

  return (
    <Stage
      onMouseDown={() => {
        model.clearSelect();
      }}
      scale={model.canvasData.scale}
      x={model.canvasData.x}
      y={model.canvasData.y}
      draggable={true}
      onDragMove={(e) => {
        model.setStagePosition(
          e.currentTarget.attrs.x,
          e.currentTarget.attrs.y
        );
      }}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <FlowContext.Provider
        value={{
          model,
        }}
      >
        {renderComponents(model.canvasData.cells, model)}
      </FlowContext.Provider>
    </Stage>
  );
});

type FlowProps = { canvasData: any; onEvent: (e: any) => void; modelRef: any };

@observer
class Flow extends React.Component<FlowProps, {}> {
  eventBus;
  flowModel;

  constructor(props: FlowProps) {
    super(props);

    this.flowModel = new FlowModel(props.onEvent);
    this.flowModel.setCanvasData(this.props.canvasData);
    props.modelRef.current = this.flowModel;

    registComponents(this.flowModel);
  }

  render() {
    const { flowModel: model } = this;
    return <Canvas model={model} />;
  }
}

export default Flow;
