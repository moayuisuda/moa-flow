import { Stage, Layer, Group, useStrictMode } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { useRef, useState } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import { useEffect } from "react";
import { initHotKeys } from "./hotKeys";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import { Stage as KonvaStage } from "konva/lib/Stage";

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

  const setLinkingPosition = (e) => {
    const {
      buffer: { link },
    } = model;

    if (!link.source) return;

    model.setLinkingPosition(e);
  };

  useEffect(() => {
    // zIndex not work in first render，issue link https://github.com/konvajs/react-konva/issues/194
    setSecondRefresh(1);
  });

  const { buffer } = model;

  return (
    <Stage
      ref={stageRef}
      onMouseDown={(e) => {
        model.clearSelect();
        model.hotKey.MouseDown = true;

        if (!model.hotKey["Space"]) {
          const pos = stageRef.current.getRelativePointerPosition();
          model.setMultiSelect({
            start: {
              x: pos.x,
              y: pos.y,
            },
            end: {
              x: pos.x,
              y: pos.y,
            },
          });
        }
      }}
      onMouseMove={(e) => {
        setLinkingPosition(e);
        if (model.hotKey["Space"] && model.hotKey["MouseDown"]) {
          model.setStagePosition(
            e.currentTarget.attrs.x + e.evt.movementX,
            e.currentTarget.attrs.y + e.evt.movementY
          );
        }

        if (!model.hotKey["Space"] && model.hotKey["MouseDown"]) {
          const pos = stageRef.current.getRelativePointerPosition();
          model.setMultiSelect({
            end: {
              x: pos.x,
              y: pos.y,
            },
          });
        }
      }}
      onMouseUp={(e) => {
        model.clearLinkBuffer();
        model.hotKey.MouseDown = false;

        const pos = stageRef.current.getRelativePointerPosition();
        model.setMultiSelect({
          start: {
            x: pos.x,
            y: pos.y,
          },
          end: {
            x: pos.x,
            y: pos.y,
          },
        });
      }}
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

  componentDidMount(): void {
    initHotKeys(this.flowModel);
  }

  initHotKeys() {}
}

export default Flow;
