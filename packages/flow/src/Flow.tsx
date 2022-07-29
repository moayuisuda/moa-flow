import React from "react";
import { LinkingEdge } from "./cells/LinkingEdge";
import FlowModel from "./Model";

import { computed } from "mobx";
import { observer } from "mobx-react";
import { FlowContext } from "./Context";

import { getContextMenu, SelectBoundsRect } from "./components";

import { useContext } from "react";
import { CellDataType, CellModel } from "./cells/Cell";
import { STAGE_ID } from "./constants";
import { color } from "./theme/style";
import { initEvents } from "./events";
import { BehaviorName, CanvasDataType } from "typings/common";
import { Interactor } from "./components/Interacotr";

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
    throw `[flow-infra] component ${cellData.component} is not regist.`;

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
    throw `[flow-infra] component ${cellData.component} is not regist.`;

  const Model = context.modelFactoriesMap.get(
    cellData.component
  ) as typeof CellModel;
  const cellModel = new Model(cellData, context);
  context.cellsModelMap.set(cellData.id, cellModel);

  return React.createElement(Interactor, {
    key: cellData.id,
    id: cellData.id,
    inSvg: !isNode,
    children: React.createElement(Component, {
      model: cellModel, // 这里只是传了cellModel，最后返回了个ReactNode，但是cellModel内的属性并没有被读取，CellComponent也就没有收集Model的依赖
      key: cellData.id,
    }),
  });
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
    <div>
      {/* {_dots.map((dot) => {
        return <Circle cx={dot.x} cy={dot.y} r={2} fill={color.deepGrey} />;
      })} */}
    </div>
  );
});

const getViewBox = (context: FlowModel) => {
  return `${-context.x / context.scale} ${-context.y / context.scale} ${
    context.width / context.scale
  } ${context.height / context.scale}`;
};

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
      // <Group
      //   {..._gridPos}
      //   zIndex={0}
      //   ref={this.gridRef}
      //   visibility={grid && this.context.scale >= 1 ? "visible" : "hidden"}
      // >
      //   <Dots />
      // </Group>
      <></>
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
    <>
      <div
        style={{
          zIndex: 1,
          position: "absolute",
          pointerEvents: "none",
          left: context.x,
          top: context.y,
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
    </>
  );
});

const LinesAndInterect = observer(() => {
  const context = useContext(FlowContext);

  return (
    <svg
      viewBox={getViewBox(context)}
      style={{
        zIndex: 0,
        position: "absolute",
        pointerEvents: "none",
      }}
      ref={(ref) => (context.refs.svgContainerRef = ref)}
      width={context.width}
      height={context.height}
    >
      {/* {model.grid && <Grid />} */}
      <Edges />
      <LinkingEdge data={context.buffer.link} />
      <SelectBoundsRect />
    </svg>
  );
});

type FlowProps = {
  canvasData?: any;
  onEvent?: (e: { type: string; data: any }) => void;
  onLoad?: (model: FlowModel) => void;
  scale?: boolean;
  modelRef?: any;
  width?: number;
  height?: number;
  grid?: number;
  multiSelect?: boolean;
  components?: Record<string, React.FC<any>>;
  linkEdge?: string;
};
@observer
class Flow extends React.Component<FlowProps, {}> {
  flowModel: FlowModel;

  constructor(
    props: FlowProps = {
      scale: true,
      multiSelect: false,
    }
  ) {
    super(props);

    this.flowModel = new FlowModel(props.onEvent);
    this.props.canvasData &&
      this.flowModel.setCanvasData(this.props.canvasData);
    this.props.grid && (this.flowModel.grid = this.props.grid);

    if (this.props.width && this.props.height) {
      this.flowModel.size = {
        width: this.props.width,
        height: this.props.height,
      };
    }
    this.props.onLoad && this.props.onLoad(this.flowModel);

    props.modelRef && (props.modelRef.current = this.flowModel);
    this.flowModel.registComponents(props.components || {});
  }

  getEvents() {
    const extraEvents: BehaviorName[] = ["scale", "multiSelect"];
    const defaultEvents: BehaviorName[] = [
      "clearState",
      "link",
      "drag",
      "select",
      "hotkeys",
      "scale",
    ];

    const events: BehaviorName[] = [...defaultEvents];
    extraEvents.forEach((event) => {
      if (this.props[event as keyof FlowProps]) events.push(event);
    });

    return initEvents(events, this.flowModel);
  }

  render() {
    const { flowModel: model } = this;

    return (
      <FlowContext.Provider value={model}>
        <div>
          {getContextMenu(this.props.children)}
          <div
            style={{
              overflow: "hidden",
              display: "inline-block",
              position: "absolute",
              width: model.width,
              height: model.height,
              cursor: model.hotKey["Space"] ? "move" : "auto",
            }}
            id={STAGE_ID}
            ref={(ref) => {
              model.refs.stageRef = ref;
            }}
            {...this.getEvents()}
          >
            <Nodes />
            <LinesAndInterect />
          </div>
        </div>
      </FlowContext.Provider>
    );
  }
}

export default Flow;
