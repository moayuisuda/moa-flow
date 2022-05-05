import { Stage, Layer, Group, useStrictMode, Circle, Rect } from "react-konva";
import LinkingEdge from "./cells/LinkingEdge";
import React, { createRef } from "react";
import FlowModel from "./Model";

import { observer } from "mobx-react";
import { computed } from "mobx";
import { FlowContext } from "./Context";

import { registComponents } from "./utils/registComponents";
import SelectBoundsRect from "./scaffold/SelectBoundsRect";
import Konva from "konva";

import {
  initDrag,
  initClearState,
  initLink,
  initScale,
  initHotKeys,
  initDataChangeListener,
} from "./events";
import { useEffect, useState, useContext } from "react";
import { STAGE_CLASS_NAME } from "./constants";
import { getRightClickPanel } from "./components/RightClickPanel/index";
import { initMultiSelect } from "./events";
import { color } from "./theme/style";
import { autorun } from "mobx";

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
        return <Circle x={dot.x} y={dot.y} radius={1} fill={color.deepGrey} />;
      })}
    </Group>
  );
});
@observer
class Grid extends React.Component<{}> {
  static contextType = FlowContext;
  // vscode 无法推断 this.context 的类型，需要显式声明 this.context 的类型
  declare context: React.ContextType<typeof FlowContext>;

  componentDidMount() {
    autorun(() => {
      console.log(this.context.width(), this.context.height());

      requestAnimationFrame(() => {
        if (this.gridRef.current) {
          this.gridRef.current.isCached() && this.gridRef.current.clearCache();
          this.gridRef.current.cache();
        }
      });
    });
  }

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
      <Layer
        {..._gridPos}
        zIndex={0}
        listening={false}
        ref={this.gridRef}
        visible={!!(this.context.grid && this.context.scale() >= 1)}
      >
        <Dots />
      </Layer>
    );
  }
}

const Edges = observer((props: { linesLayerRef; model }) => {
  const { linesLayerRef, model } = props;
  const [_, setSecondRefresh] = useState(0);

  useEffect(() => {
    setSecondRefresh(1);
  }, []);

  const edgesData = model.canvasData.cells.filter(
    (cellData) => cellData.cellType === "edge"
  );

  return (
    <Layer ref={linesLayerRef} zIndex={1}>
      {edgesData.map((cellData) => {
        return renderComponent(cellData, model);
      })}
    </Layer>
  );
});

const Nodes = observer((props: { nodesLayerRef; model }) => {
  const { nodesLayerRef, model } = props;

  const nodesData = model.canvasData.cells.filter((cellData) => {
    return cellData.cellType !== "edge";
  });

  return (
    <Layer ref={nodesLayerRef} zIndex={2}>
      {nodesData.slice(0, nodesData.length).map((cellData) => {
        return renderComponent(cellData, model);
      })}
    </Layer>
  );
});

const InteractTop = observer((props: { model; topLayerRef }) => {
  const { model, topLayerRef } = props;

  const nodesData = model.canvasData.cells.filter((cellData) => {
    return cellData.cellType !== "edge";
  });

  return (
    <Layer zIndex={3} ref={topLayerRef}>
      <LinkingEdge data={model.buffer.link}></LinkingEdge>
      <SelectBoundsRect />
    </Layer>
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
  nodesLayerRef;
  linesLayerRef;
  topLayerRef;

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

    // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
    useStrictMode(true);

    const { refs } = this.flowModel;
    this.stageRef = refs.stageRef = createRef<Konva.Stage>();
    this.nodesLayerRef = refs.nodesLayerRef = createRef<Konva.Layer>();
    this.linesLayerRef = refs.linesLayerRef = createRef<Konva.Layer>();
    this.topLayerRef = createRef<Konva.Layer>();
    // 第一次渲染zIndex失效，issue link https://github.com/konvajs/react-konva/issues/194

    registComponents(this.flowModel);
  }

  componentDidMount(): void {
    const { flowModel: model } = this;

    const stage = this.stageRef.current as Konva.Stage;
    const linesLayer = this.linesLayerRef.current as Konva.Layer;
    const nodesLayer = this.nodesLayerRef.current as Konva.Layer;
    const topLayer = this.topLayerRef.current as Konva.Layer;
    const { zoom = true, multiSelect = false } = this.props;

    initClearState(model, stage);
    initLink(model, stage);
    initDrag(model, stage, {
      linesLayer,
      nodesLayer,
      topLayer,
    });

    zoom &&
      initScale(model, stage, {
        linesLayer,
        nodesLayer,
      });

    multiSelect &&
      initMultiSelect(model, stage, {
        linesLayer,
        nodesLayer,
        topLayer,
      });
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
        }}
      >
        <FlowContext.Provider value={model}>
          {getRightClickPanel(this.props.children)}
          <Stage
            className={STAGE_CLASS_NAME}
            ref={this.stageRef}
            scale={{ x: model.canvasData.scale, y: model.canvasData.scale }}
            x={model.x()}
            y={model.y()}
            width={model.width()}
            height={model.height()}
          >
            {/* Provider需要在Stage内部，issue https://github.com/konvajs/react-konva/issues/188 */}
            <FlowContext.Provider value={model}>
              {this.props.grid && <Grid />}
              {/* 先注册节点，后注册线，线的一些计算属性需要节点的map */}
              <Nodes nodesLayerRef={this.nodesLayerRef} model={model} />
              <Edges linesLayerRef={this.linesLayerRef} model={model} />
              <InteractTop topLayerRef={this.topLayerRef} model={model} />
            </FlowContext.Provider>
          </Stage>
        </FlowContext.Provider>
      </div>
    );
  }
}

export default Flow;
