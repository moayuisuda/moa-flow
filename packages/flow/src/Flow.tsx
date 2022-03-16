import { Stage, Layer, Group, useStrictMode } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { useRef, useState } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import { useEffect } from "react";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import Konva from "konva";
import {
  initDrag,
  initMultiSelect,
  initLinkingLine,
  initStage,
  initScale,
  initHotKeys,
} from "./events";

const renderComponent = (cellData, model) => {
  return React.createElement(
    model.componentsMap.get(cellData.component) || Group,
    {
      data: cellData,
      key: cellData.id,
    }
  );
};

const Canvas = observer((props) => {
  const { model } = props;
  const stageRef = useRef<Konva.Stage>();
  const nodesLayerRef = useRef<Konva.Layer>();
  const linesLayerRef = useRef<Konva.Layer>();
  const [_, setSecondRefresh] = useState(0);

  // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
  useStrictMode(true);

  useEffect(() => {
    const stage = stageRef.current;
    const linesLayer = linesLayerRef.current;
    const nodesLayer = nodesLayerRef.current;
    initStage(model, stage);
    initDrag(model, stage, {
      linesLayer,
      nodesLayer,
    });
    initScale(model, stage, {
      linesLayer,
      nodesLayer,
    });
    initMultiSelect(model, stage);
    initLinkingLine(model, stage);
    initHotKeys(model);

    // 第一次渲染zIndex失效，issue link https://github.com/konvajs/react-konva/issues/194
    Promise.resolve().then(() => {
      setSecondRefresh(1);
    });
  }, []);

  const nodesData = model.canvasData.cells.filter(
    (cellData) => cellData.type !== "edge"
  );
  const edgesData = model.canvasData.cells.filter(
    (cellData) => cellData.type === "edge"
  );

  return (
    <Stage
      ref={stageRef}
      scale={model.canvasData.scale}
      // draggable={true}
      x={model.canvasData.x}
      y={model.canvasData.y}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      {/* Provider需要在Stage内部，issue https://github.com/konvajs/react-konva/issues/188 */}
      <FlowContext.Provider
        value={{
          model,
        }}
      >
        {/* 先注册节点，后注册线，线的一些计算属性需要节点的map */}
        <Layer ref={nodesLayerRef} zIndex={1}>
          {nodesData.slice(0, nodesData.length - 1).map((cellData) => {
            return renderComponent(cellData, model);
          })}
        </Layer>

        <Layer zIndex={2}>
          {renderComponent(nodesData[nodesData.length - 1], model)}
          <LinkingEdge data={model.buffer.link}></LinkingEdge>
          <SelectBoundsRect />
        </Layer>

        <Layer ref={linesLayerRef} zIndex={0}>
          {edgesData.map((cellData) => {
            return renderComponent(cellData, model);
          })}
        </Layer>
      </FlowContext.Provider>
    </Stage>
  );
});

type FlowProps = {
  canvasData: any;
  onEvent?: (e: { type: string; data: any }) => void;
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
