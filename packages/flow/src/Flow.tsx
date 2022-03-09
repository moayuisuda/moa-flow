import { Stage, Layer, Group, useStrictMode } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { useRef } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";

const renderComponent = (cellData, model) => {
  return React.createElement(
    model.componentsMap.get(cellData.component) || Group,
    {
      data: cellData,
      key: cellData.id,
    }
  );
};

const renderComponents = (cellsData, model) => {
  return (
    <Layer>
      <Group zIndex={1}>
        {cellsData
          // 先渲染注册节点，后渲染注册线
          .filter((cellData) => cellData.type !== "edge")
          .map((cellData) => {
            return renderComponent(cellData, model);
          })}
      </Group>
      <Group zIndex={0}>
        {cellsData
          .filter((cellData) => cellData.type === "edge")
          .map((cellData) => {
            return renderComponent(cellData, model);
          })}
      </Group>

      <LinkingEdge data={model.buffer.link}></LinkingEdge>
    </Layer>
  );
};

const Canvas = observer((props) => {
  const { model } = props;
  const stageRef = useRef();

  // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
  useStrictMode(true);

  const setLinkingPosition = (e) => {
    const {
      buffer: { link },
    } = model;

    if (!link.source) return;

    model.setLinkingPosition(e);
  };

  return (
    <Stage
      ref={stageRef}
      onMouseDown={() => {
        model.clearSelect();
      }}
      onMouseMove={(e) => {
        setLinkingPosition(e);
      }}
      onMouseUp={(e) => {
        model.clearLinkBuffer();
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

type FlowProps = {
  canvasData: any;
  onEvent?: (e: any) => void;
  onLoad?: (model: FlowModel) => void;
  modelRef?: any;
};

@observer
class Flow extends React.Component<FlowProps, {}> {
  eventBus;
  flowModel;

  constructor(props: FlowProps) {
    super(props);

    this.flowModel = new FlowModel(props.onEvent);
    this.flowModel.setCanvasData(this.props.canvasData);

    props.modelRef && (props.modelRef.current = this.flowModel);
    props.onLoad && props.onLoad(this.flowModel);

    registComponents(this.flowModel);
  }

  render() {
    const { flowModel: model } = this;
    return <Canvas model={model} />;
  }
}

export default Flow;
