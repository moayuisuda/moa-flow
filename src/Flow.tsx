import React from "react";
import { LinkingEdge } from "./cells/LinkingEdge";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { getContextMenu, SelectBoundsRect } from "./components";

import { useContext } from "react";
import { CellDataType, CellModel } from "./cells/Cell";
import { STAGE_ID } from "./constants";
import { mountEvents } from "./events";
import { BehaviorName, CanvasDataType } from "@/typings/common";
import { Interactor } from "./components/Interacotr";
import { isNumber, isUndefined } from "lodash";

const PositionWrapper = observer(({ cellData }: { cellData: CellDataType }) => {
  const isNode = cellData.cellType === "node";
  const context = useContext(FlowContext);
  const absolutePosition = isNode
    ? context.getNodePosition(cellData.id)
    : { x: 0, y: 0 };
  const Component = context.componentsMap.get(cellData.component) as React.FC<{
    model: CellModel;
  }>;

  if (!Component)
    throw `[moa-flow] component ${cellData.component} not regist.`;

  return React.createElement(isNode ? "div" : "g", {
    ref: context.getWrapperRef(cellData.id),
    style: isNode
      ? {
          position: "absolute",
          left: absolutePosition.x,
          top: absolutePosition.y,
        }
      : {},
    // 这里cellData没变符合pure，且在CellComponent中没有引用x，y，所以变化位置时不会重渲染
    children: <CellComponent cellData={cellData} />,
  });
});

const CellComponent = observer(({ cellData }: { cellData: CellDataType }) => {
  const isNode = cellData.cellType === "node";
  const context = useContext(FlowContext);
  const Component = context.componentsMap.get(cellData.component) as React.FC<{
    model: CellModel;
  }>;
  if (!Component)
    throw `[moa-flow] component ${cellData.component} is not regist.`;

  const cellModel = context.getCellModel(cellData.id) as CellModel;

  return React.createElement(Interactor, {
    key: cellData.id,
    id: cellData.id,
    inSvg: !isNode,
    model: cellModel,
    children: React.createElement(Component, {
      model: cellModel, // 这里只是传了cellModel，最后返回了个ReactNode，但是cellModel内的属性并没有被读取，CellComponent也就没有收集Model的依赖
      key: cellData.id,
    }),
  });
});

const getViewBox = (context: FlowModel) => {
  return `${-context.x} ${-context.y} ${context.width / context.scale} ${
    context.height / context.scale
  }`;
};

@observer
class Grid extends React.Component<{}> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  constructor(props: any) {
    super(props);
  }

  render() {
    const grid = this.context.grid as number;
    const { context } = this;
    const radius = 1;

    return (
      <svg
        viewBox={getViewBox(context)}
        style={{
          zIndex: 0,
          left: 0,
          position: "absolute",
          pointerEvents: "none",
        }}
        ref={(ref) => (context.refs.svgContainerRef = ref)}
        width={context.width}
        height={context.height}
      >
        <defs>
          <pattern
            id="dot"
            x={-radius}
            y={-radius}
            width={grid}
            height={grid}
            patternUnits="userSpaceOnUse"
          >
            <circle
              className="moa-grid__dot"
              cx={radius}
              cy={radius}
              r={radius}
              fill={context.color.base}
            />
          </pattern>
        </defs>
        <rect
          x={-this.context.x}
          y={-this.context.y}
          width="100%"
          height="100%"
          fill="url(#dot)"
        />
      </svg>
    );
  }
}

const Edges = observer(() => {
  const context = useContext(FlowContext);

  const edgesData = context.canvasData.cells.filter(
    (cellData: CellDataType) => cellData.cellType === "edge"
  );

  return (
    <>
      {edgesData.map((cellData: CellDataType) => (
        <PositionWrapper cellData={cellData} key={cellData.id} />
      ))}
    </>
  );
});

const Nodes = observer(() => {
  const context = useContext(FlowContext);

  const nodesData = context.canvasData.cells.filter((cellData) => {
    return cellData.cellType !== "edge";
  });

  return (
    <div
      className="moa-flow-nodes"
      style={{
        zIndex: 2,
        position: "absolute",
        pointerEvents: "none",
        // 这里div的left和right是不受scale控制的，所以要额外*scale
        left: context.x * context.scale,
        top: context.y * context.scale,
        transform: `scale(${context.scale}, ${context.scale})`,
        transformOrigin: "top left",
        width: context.width,
        height: context.height,
      }}
      ref={(ref) => (context.refs.divContainerRef = ref)}
    >
      {nodesData.slice(0, nodesData.length).map((cellData) => (
        <PositionWrapper cellData={cellData} key={cellData.id} />
      ))}
    </div>
  );
});

const LinesAndInterect = observer(() => {
  const context = useContext(FlowContext);

  return (
    <svg
      className="moa-flow-edges"
      viewBox={getViewBox(context)}
      style={{
        zIndex: 1,
        left: 0,
        position: "absolute",
        pointerEvents: "none",
      }}
      ref={(ref) => (context.refs.svgContainerRef = ref)}
      width={context.width}
      height={context.height}
    >
      <Edges />
      <LinkingEdge data={context.buffer.link} />
      <SelectBoundsRect />
    </svg>
  );
});

type FlowProps = {
  canvasData?: Partial<CanvasDataType>;
  components?: Record<string, React.FC<{ model: any }>>;
  models?: Record<string, typeof CellModel>;
  onEvent?: (e: { type: string; data: any }) => void;
  onLoad?: (model: FlowModel) => void;
  scale?: boolean;
  flowModelRef?: any;
  width?: number;
  height?: number;
  scaleBy?: number;
  grid?: number;
  multiSelect?: boolean;
  linkEdge?: string;
  children?: React.ReactNode;
  undoRedo?: boolean;
};
@observer
class Flow extends React.Component<FlowProps, {}> {
  flowModel: FlowModel;
  static defaultProps: {};

  constructor(props: FlowProps) {
    super(props);
    this.flowModel = new FlowModel(props.onEvent);
    this.flowModel.registModels(props.models || {});
    this.flowModel.registComponents(props.components || {});
    !isUndefined(this.flowModel.scaleBy) &&
      (this.flowModel.scaleBy = this.props.scaleBy || 1.01);
    this.props.linkEdge && (this.flowModel.linkEdge = this.props.linkEdge);
    this.props.canvasData &&
      this.flowModel.setCanvasData(this.props.canvasData);
    this.props.grid && (this.flowModel.grid = this.props.grid);
    this.flowModel.multiSelect = props.multiSelect || false;

    if (this.props.width && this.props.height) {
      this.flowModel.size = {
        width: this.props.width,
        height: this.props.height,
      };
    }
    this.props.onLoad && this.props.onLoad(this.flowModel);
    props.flowModelRef && (props.flowModelRef.current = this.flowModel);
  }

  componentDidMount() {
    if (getContextMenu(this.props.children)) this.initStageEvent();
  }

  initStageEvent = () => {
    document
      .querySelector("#" + STAGE_ID)
      ?.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.flowModel.contextMenuVisible = true;

        this.flowModel.setContextMenuPos({
          x: e.clientX + 5,
          y: e.clientY + 5,
        });
      });
  };

  generateEvents() {
    // 将scale和undoredo放在extraEvent里
    const extraEvents: BehaviorName[] = ["scale", "multiSelect", "undoRedo"];
    const defaultEvents: BehaviorName[] = [
      "clearState",
      "link",
      "drag",
      "select",
      "hotkeys",
    ];

    const events: BehaviorName[] = [...defaultEvents];
    extraEvents.forEach((event) => {
      if (this.props[event as keyof FlowProps]) events.push(event);
    });
    return mountEvents(events, this.flowModel);
  }

  render() {
    const { flowModel: model } = this;

    return (
      <FlowContext.Provider value={model}>
        <div
          style={{
            overflow: "hidden",
            position: "relative",
            width: model.width,
            height: model.height,
            cursor: model.hotKey["Space"] ? "move" : "auto",
          }}
          id={STAGE_ID}
          ref={(ref) => {
            model.refs.stageRef = ref;
          }}
          {...this.generateEvents()}
        >
          {isNumber(this.flowModel.grid) && this.flowModel.grid !== 0 && (
            <Grid />
          )}
          <Nodes />
          <LinesAndInterect />
          {this.props.children}
        </div>
      </FlowContext.Provider>
    );
  }
}

Flow.defaultProps = {
  undoRedo: true,
  scale: true,
  mutiSelect: false,
};

export default Flow;
