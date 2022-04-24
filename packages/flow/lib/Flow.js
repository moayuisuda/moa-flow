import { __decorate } from './node_modules/tslib/tslib.es6.js';
import { Group, Circle, Layer, useStrictMode, Stage } from 'react-konva';
import LinkingEdge from './cells/LinkingEdge.js';
import React, { useContext, useState, useEffect, createRef } from 'react';
import { FlowModel } from './Model.js';
import { observer } from 'mobx-react';
import { computed, autorun } from 'mobx';
import { FlowContext } from './Context.js';
import { registComponents } from './utils/registComponents.js';
import SelectBoundsRect from './scaffold/SelectBoundsRect.js';
import { initClearState, initLink, initDrag, initScale, initMultiSelect, initHotKeys } from './events.js';
import { STAGE_CLASS_NAME } from './constants.js';
import { getRightClickPanel } from './components/RightClickPanel/index.js';
import { color } from './theme/style.js';
import 'react-konva-utils';
import './packages/flow/lib/Flow.js';
import './packages/flow/lib/cells/Cell.js';
import './packages/flow/lib/cells/Node.js';
import './packages/flow/lib/cells/Edge.js';
import './packages/flow/lib/scaffold/Interactor.js';
import './packages/flow/lib/scaffold/Port.js';
import './packages/flow/lib/components/RightClickPanel/index.js';
import './packages/flow/lib/components/Image.js';

const renderComponent = (cellData, model) => {
    return React.createElement(model.componentsMap.get(cellData.component) || Group, {
        data: cellData,
        key: cellData.id,
    });
};
const Dots = observer(() => {
    const model = useContext(FlowContext);
    const _dots = computed(() => {
        const re = [];
        // @TODO
        for (let i = 0; i <= model.height(); i += model.grid) {
            for (let j = 0; j <= model.width(); j += model.grid) {
                re.push({
                    x: j,
                    y: i,
                });
            }
        }
        return re;
    }).get();
    return (React.createElement(Group, null, _dots.map((dot) => {
        return React.createElement(Circle, { x: dot.x, y: dot.y, radius: 1, fill: color.deepGrey });
    })));
});
let Grid = class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.gridRef = React.createRef();
    }
    componentDidMount() {
        // @TODO
        autorun(() => {
            console.log(this.context.width(), this.context.height());
            this.gridRef.current.cache();
        });
    }
    render() {
        const grid = this.context.grid;
        const { canvasData } = this.context;
        const _gridPos = computed(() => {
            return {
                x: -Math.round(canvasData.x / grid) * grid,
                y: -Math.round(canvasData.y / grid) * grid,
            };
        }).get();
        return (React.createElement(Layer, { zIndex: 0, listening: false },
            React.createElement(Group, Object.assign({}, _gridPos, { ref: this.gridRef }),
                React.createElement(Dots, null))));
    }
};
Grid.contextType = FlowContext;
Grid = __decorate([
    observer
], Grid);
const Edges = observer((props) => {
    const { linesLayerRef, model } = props;
    const [_, setSecondRefresh] = useState(0);
    useEffect(() => {
        setSecondRefresh(1);
    }, []);
    const edgesData = model.canvasData.cells.filter((cellData) => cellData.cellType === "edge");
    return (React.createElement(Layer, { ref: linesLayerRef, zIndex: 1 }, edgesData.map((cellData) => {
        return renderComponent(cellData, model);
    })));
});
const Nodes = observer((props) => {
    const { nodesLayerRef, model } = props;
    const nodesData = model.canvasData.cells.filter((cellData) => {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Layer, { ref: nodesLayerRef, zIndex: 2 }, nodesData.slice(0, nodesData.length).map((cellData) => {
        return renderComponent(cellData, model);
    })));
});
const InteractTop = observer((props) => {
    const { model, topLayerRef } = props;
    model.canvasData.cells.filter((cellData) => {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Layer, { zIndex: 3, ref: topLayerRef },
        React.createElement(LinkingEdge, { data: model.buffer.link }),
        React.createElement(SelectBoundsRect, null)));
});
let Flow = class Flow extends React.Component {
    constructor(props) {
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
        this.stageRef = refs.stageRef = createRef();
        this.nodesLayerRef = refs.nodesLayerRef = createRef();
        this.linesLayerRef = refs.linesLayerRef = createRef();
        this.topLayerRef = createRef();
        // 第一次渲染zIndex失效，issue link https://github.com/konvajs/react-konva/issues/194
        registComponents(this.flowModel);
    }
    componentDidMount() {
        const { flowModel: model } = this;
        const stage = this.stageRef.current;
        const linesLayer = this.linesLayerRef.current;
        const nodesLayer = this.nodesLayerRef.current;
        const topLayer = this.topLayerRef.current;
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
            initMultiSelect(model, stage);
        initHotKeys(model, stage);
        initHotKeys(model, stage);
    }
    render() {
        const { flowModel: model } = this;
        return (React.createElement("div", { style: {
                position: "relative",
            } },
            React.createElement(FlowContext.Provider, { value: model },
                getRightClickPanel(this.props.children),
                React.createElement(Stage, { className: STAGE_CLASS_NAME, ref: this.stageRef, scale: { x: model.canvasData.scale, y: model.canvasData.scale }, x: model.x(), y: model.y(), width: model.width(), height: model.height() },
                    React.createElement(FlowContext.Provider, { value: model },
                        model.grid && model.scale() >= 1 && React.createElement(Grid, null),
                        React.createElement(Nodes, { nodesLayerRef: this.nodesLayerRef, model: model }),
                        React.createElement(InteractTop, { topLayerRef: this.topLayerRef, model: model }),
                        React.createElement(Edges, { linesLayerRef: this.linesLayerRef, model: model }))))));
    }
};
Flow = __decorate([
    observer
], Flow);
var Flow$1 = Flow;

export { Flow$1 as default };
