import { Renderer as CanvasRenderer } from "@antv/g-canvas";
import { Canvas as RGCanvas, Circle, Group } from "@antv/react-g";
import React, { createRef } from "react";
import LinkingEdge from "./cells/LinkingEdge";
import FlowModel from "./Model";

import { computed } from "mobx";
import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import * as G from "@antv/g";
import { getContextMenu, SelectBoundsRect } from "./components";
import { registComponents } from "./utils/registComponents";

import { useContext } from "react";
import { CellDataType } from "./cells/Cell";
import { STAGE_ID } from "./constants";
import {
  initClearState,
  initDataChangeListener,
  initDrag,
  initHotKeys,
  initLink,
  initMultiSelect,
  initScale,
  initSelect,
} from "./events";
import { color } from "./theme/style";
import { getCanvas } from "./utils/getElement";

const renderer = new CanvasRenderer();

const CellComponent = observer(({ cellData }: { cellData: CellDataType }) => {
  const model = useContext(FlowContext);
  const absolutePosition =
    cellData.cellType === "node"
      ? model.getNodePosition(cellData.id)
      : { x: 0, y: 0 };

  return (
    <Group {...absolutePosition}>
      {React.createElement(
        model.componentsMap.get(cellData.component) || Group,
        {
          data: cellData,
          key: cellData.id,
          wrapperRef: model.getWrapperRef(cellData.id),
        }
      )}
    </Group>
  );
});

const Dots = observer(() => {
  const model = useContext(FlowContext);
  // const EXTRA = model.grid as number;
  const EXTRA = 0;

  const _dots = computed(() => {
    const re = [];
    for (let i = -EXTRA; i <= model.height + EXTRA; i += model.grid as number) {
      for (
        let j = -EXTRA;
        j <= model.width + EXTRA;
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
        return <Circle cx={dot.x} cy={dot.y} r={2} fill={color.deepGrey} />;
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
        x: -Math.round(this.context.x / this.context.scale / grid) * grid,
        y: -Math.round(this.context.y / this.context.scale / grid) * grid,
      };
    }).get();

    return (
      <Group
        {..._gridPos}
        zIndex={0}
        ref={this.gridRef}
        visibility={grid && this.context.scale >= 1 ? "visible" : "hidden"}
      >
        <Dots />
      </Group>
    );
  }
}

const Edges = observer(() => {
  const context = useContext(FlowContext);

  const edgesData = context.canvasData.cells.filter(
    (cellData: CellDataType) => cellData.cellType === "edge"
  );

  return (
    <Group zIndex={1}>
      {edgesData.map((cellData: CellDataType) => (
        <CellComponent cellData={cellData} key={cellData.id} />
      ))}
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
      {nodesData.slice(0, nodesData.length).map((cellData) => (
        <CellComponent cellData={cellData} key={cellData.id} />
      ))}
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
    this.props.grid && (this.flowModel.grid = this.props.grid);

    if (this.props.width && this.props.height) {
      this.flowModel.size = {
        width: this.props.width,
        height: this.props.height,
      };
    }
    this.props.onLoad && this.props.onLoad(this.flowModel);

    props.modelRef && (props.modelRef.current = this.flowModel);
    const { refs } = this.flowModel;
    this.stageRef = refs.stageRef = createRef<G.Canvas>();

    registComponents(this.flowModel);
  }

  componentDidMount = async () => {
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

    await this.stageRef.current?.ready;
    this.props.canvasData &&
      this.flowModel.setCanvasData(this.props.canvasData);
  };

  render() {
    const { flowModel: model } = this;

    return (
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          display: "inline-block",
        }}
        id={STAGE_ID}
      >
        <FlowContext.Provider value={model}>
          {getContextMenu(this.props.children)}
          <RGCanvas
            renderer={renderer}
            ref={this.stageRef}
            width={model.width}
            height={model.height}
          >
            <Group
              transform={`scale(${model.scale}, ${model.scale})`}
              // @ts-ignore
              x={model.x}
              y={model.y}
            >
              <FlowContext.Provider value={model}>
                {model.grid && <Grid />}
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
