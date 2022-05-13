import { Canvas as RGCanvas, Group, Circle } from "@antv/react-g";
import LinkingEdge from "./cells/LinkingEdge";
import React, { createRef } from "react";
import FlowModel from "./Model";
import { Renderer as CanvasRenderer } from "@antv/g-canvas";

import { observer } from "mobx-react";
import { computed } from "mobx";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import * as G from "@antv/g";

import {
  initDrag,
  initClearState,
  initLink,
  initScale,
  initHotKeys,
  initDataChangeListener,
} from "./events";
import { useEffect, useState, useContext } from "react";
import { STAGE_ID } from "./constants";
import { initMultiSelect, initSelect } from "./events";
import { color } from "./theme/style";
import { CellDataType } from "./cells/Cell";
import { getCanvas } from "./utils/getElement";
import RightClickPanel, {
  getRightClickPanel,
} from "./components/RightClickPanel";

const renderer = new CanvasRenderer();

const renderComponent = (cellData, model) => {
  return React.createElement(
    model.componentsMap.get(cellData.component) || Group,
    {
      data: cellData,
      key: cellData.id,
    }
  );
};

const Dots = observer(() => {
  const model = useContext(FlowContext);
  // const EXTRA = model.grid as number;
  const EXTRA = 0;

  const _dots = computed(() => {
    const re = [];
    // @TODO
    for (
      let i = -EXTRA;
      i <= model.height() + EXTRA;
      i += model.grid as number
    ) {
      for (
        let j = -EXTRA;
        j <= model.width() + EXTRA;
        j += model.grid as number
      ) {
        re.push({
          x: j,
          y: i,
        });
      }
    }

    return re;
  }).get();

  return (
    <Group>
      {_dots.map((dot) => {
        return <Circle x={dot.x} y={dot.y} r={1} fill={color.deepGrey} />;
      })}
    </Group>
  );
});
@observer
class Grid extends React.Component<{}> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;
  gridRef: any;

  constructor(props: any) {
    super(props);
    this.gridRef = React.createRef();
  }

  render() {
    const grid = this.context.grid as number;

    const _gridPos = computed(() => {
      return {
        x: -Math.round(this.context.x() / this.context.scale() / grid) * grid,
        y: -Math.round(this.context.y() / this.context.scale() / grid) * grid,
      };
    }).get();

    return (
      <Group
        {..._gridPos}
        zIndex={0}
        ref={this.gridRef}
        visibility={
          this.context.grid && this.context.scale() >= 1 ? "visible" : "hidden"
        }
      >
        <Dots />
      </Group>
    );
  }
}

const Edges = observer(() => {
  const context = useContext(FlowContext);
  const [_, setSecondRefresh] = useState(0);

  useEffect(() => {
    setSecondRefresh(1);
  }, []);

  const edgesData = context.canvasData.cells.filter(
    (cellData: CellDataType) => cellData.cellType === "edge"
  );

  return (
    <Group zIndex={1}>
      {edgesData.map((cellData: CellDataType) => {
        return renderComponent(cellData, context);
      })}
    </Group>
  );
});

const Nodes = observer(() => {
  const context = useContext(FlowContext);

  const nodesData = context.canvasData.cells.filter((cellData) => {
    return cellData.cellType !== "edge";
  });

  return (
    <Group zIndex={2}>
      {nodesData.slice(0, nodesData.length).map((cellData) => {
        return renderComponent(cellData, context);
      })}
    </Group>
  );
});

const InteractTop = observer(() => {
  const context = useContext(FlowContext);

  return (
    <Group zIndex={3}>
      <LinkingEdge data={context.buffer.link} />
      <SelectBoundsRect />
    </Group>
  );
});

type FlowProps = {
  canvasData?: any;
  onEvent?: (e: { type: string; data: any }) => void;
  onLoad?: (model: FlowModel) => void;
  zoom?: boolean;
  modelRef?: any;
  width?: number;
  height?: number;
  grid?: number;
  multiSelect?: boolean;
};
@observer
class Flow extends React.Component<FlowProps, {}> {
  flowModel: FlowModel;
  stageRef;

  constructor(props: FlowProps) {
    super(props);

    this.flowModel = new FlowModel(props.onEvent);
    this.props.canvasData &&
      this.flowModel.setCanvasData(this.props.canvasData);
    this.props.grid && this.flowModel.setGrid(this.props.grid);

    if (this.props.width && this.props.height) {
      this.flowModel.setSize(this.props.width, this.props.height);
    }

    props.modelRef && (props.modelRef.current = this.flowModel);
    props.onLoad && props.onLoad(this.flowModel);

    const { refs } = this.flowModel;
    this.stageRef = refs.stageRef = createRef<G.Canvas>();

    registComponents(this.flowModel);
  }

  componentDidMount(): void {
    const { flowModel: model } = this;

    const stage = this.stageRef.current as G.Canvas;
    const { zoom = true, multiSelect = false } = this.props;

    initClearState(model, stage);
    initLink(model, stage);
    initDrag(model, stage);
    initSelect(model);

    zoom && initScale(model, stage);

    multiSelect && initMultiSelect(model, stage);
    initHotKeys(model, stage);
    initHotKeys(model, stage);
    initDataChangeListener(model);
  }

  render() {
    const { flowModel: model } = this;

    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
        id={STAGE_ID}
      >
        <FlowContext.Provider value={model}>
          {getRightClickPanel(this.props.children)}
          <RGCanvas
            renderer={renderer}
            ref={this.stageRef}
            width={model.width()}
            height={model.height()}
          >
            <Group
              transform={`scale(${model.scale()}, ${model.scale()})`}
              x={model.x()}
              y={model.y()}
            >
              <FlowContext.Provider value={model}>
                {this.props.grid && <Grid />}
                {getCanvas(this.props.children)}
              </FlowContext.Provider>
            </Group>
          </RGCanvas>
        </FlowContext.Provider>
      </div>
    );
  }
}

export const Canvas = () => {
  return (
    <>
      <Nodes />
      <Edges />
      <InteractTop />
    </>
  );
};

export default Flow;
