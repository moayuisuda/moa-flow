import { Stage, Layer, Group, useStrictMode } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { useRef, useState } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import { useEffect } from "react";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import { Stage as KonvaStage } from "konva/lib/Stage";
import {
  initDrag,
  initMultiSelect,
  initLinkingLine,
  initStage,
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

const renderComponents = (cellsData, model) => {
  return (
    <Layer>
      <Group zIndex={1}>
        {cellsData
          // regist node first, because some compute in edge need node instance
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
      <SelectBoundsRect />
    </Layer>
  );
};

const Canvas = observer((props) => {
  const { model } = props;
  const stageRef = useRef<KonvaStage>();
  const [_, setSecondRefresh] = useState(0);

  // fully controlled，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
  useStrictMode(true);

  useEffect(() => {
    // zIndex not work in first render，issue link https://github.com/konvajs/react-konva/issues/194
    setSecondRefresh(1);

    const stage = stageRef.current;
    initStage(model, stage);
    initDrag(model, stage);
    initMultiSelect(model, stage);
    initLinkingLine(model, stage);
    initHotKeys(model);
  }, []);

  return (
    <Stage
      ref={stageRef}
      scale={model.canvasData.scale}
      x={model.canvasData.x}
      y={model.canvasData.y}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      {/* Provider needs inside Stage，issue https://github.com/konvajs/react-konva/issues/188 */}
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
