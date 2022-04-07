import { Stage, Layer, Group, useStrictMode } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { createRef } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import Konva from "konva";

import {
  initDrag,
  initSelect,
  initClearState,
  initLink,
  initScale,
  initHotKeys,
} from "./events";
import { ModelType } from ".";
import { useEffect, useState } from "react";
import { STAGE_CLASS_NAME } from "./constants";
import { getRightClickPanel } from "./components/RightClickPanel/index";

const renderComponent = (cellData, model) => {
  return React.createElement(
    model.componentsMap.get(cellData.component) || Group,
    {
      data: cellData,
      key: cellData.id,
    }
  );
};

const Nodes = observer((props: { nodesLayerRef; model }) => {
  const { nodesLayerRef, model } = props;

  const nodesData = model.canvasData.cells.filter((cellData) => {
    return cellData.type !== "edge";
  });

  return (
    <Layer ref={nodesLayerRef} zIndex={1}>
      {nodesData.slice(0, nodesData.length).map((cellData) => {
        return renderComponent(cellData, model);
      })}
    </Layer>
  );
});

const InteractTop = observer((props: { model; topLayerRef }) => {
  const { model, topLayerRef } = props;

  const nodesData = model.canvasData.cells.filter((cellData) => {
    return cellData.type !== "edge";
  });

  return (
    <Layer zIndex={2} ref={topLayerRef}>
      <LinkingEdge data={model.buffer.link}></LinkingEdge>
      <SelectBoundsRect />
    </Layer>
  );
});

const Edges = observer((props: { linesLayerRef; model }) => {
  const { linesLayerRef, model } = props;
  const [_, setSecondRefresh] = useState(0);

  useEffect(() => {
    setSecondRefresh(1);
  }, []);

  const edgesData = model.canvasData.cells.filter(
    (cellData) => cellData.type === "edge"
  );

  return (
    <Layer ref={linesLayerRef} zIndex={0}>
      {edgesData.map((cellData) => {
        return renderComponent(cellData, model);
      })}
    </Layer>
  );
});

@observer
class Canvas extends React.Component<{ model: ModelType }> {
  stageRef;
  nodesLayerRef;
  linesLayerRef;
  topLayerRef;

  constructor(props) {
    super(props);

    // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
    useStrictMode(true);

    const { refs } = this.props.model;
    this.stageRef = refs.stageRef = createRef<Konva.Stage>();
    this.nodesLayerRef = refs.nodesLayerRef = createRef<Konva.Layer>();
    this.linesLayerRef = refs.linesLayerRef = createRef<Konva.Layer>();
    this.topLayerRef = createRef<Konva.Layer>();
    // 第一次渲染zIndex失效，issue link https://github.com/konvajs/react-konva/issues/194
  }

  componentDidMount(): void {
    const { model } = this.props;

    const stage = this.stageRef.current;
    const linesLayer = this.linesLayerRef.current;
    const nodesLayer = this.nodesLayerRef.current;
    const topLayer = this.topLayerRef.current;

    initClearState(model, stage);
    initLink(model, stage);
    initDrag(model, stage, {
      linesLayer,
      nodesLayer,
      topLayer,
    });
    initScale(model, stage, {
      linesLayer,
      nodesLayer,
    });
    initSelect(model, stage, {
      linesLayer,
      nodesLayer,
      topLayer,
    });
    initHotKeys(model, stage);
  }

  render() {
    const { model } = this.props;

    return (
      <Stage
        className={STAGE_CLASS_NAME}
        ref={this.stageRef}
        scale={model.canvasData.scale}
        x={model.canvasData.x}
        y={model.canvasData.y}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        {/* Provider需要在Stage内部，issue https://github.com/konvajs/react-konva/issues/188 */}
        <FlowContext.Provider value={model}>
          {/* 先注册节点，后注册线，线的一些计算属性需要节点的map */}
          <Nodes nodesLayerRef={this.nodesLayerRef} model={model} />
          <InteractTop topLayerRef={this.topLayerRef} model={model} />
          <Edges linesLayerRef={this.linesLayerRef} model={model} />
        </FlowContext.Provider>
      </Stage>
    );
  }
}

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
    this.flowModel.setCellsDataMap();

    props.modelRef && (props.modelRef.current = this.flowModel);
    props.onLoad && props.onLoad(this.flowModel);

    registComponents(this.flowModel);
  }

  render() {
    const { flowModel: model } = this;
    return (
      <div
        style={{
          position: "relative",
        }}
      >
        <FlowContext.Provider value={model}>
          {getRightClickPanel(this.props.children)}
          <Canvas model={model} />
        </FlowContext.Provider>
      </div>
    );
  }
}

export default Flow;
