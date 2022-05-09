import { __decorate } from './node_modules/tslib/tslib.es6.js';
import { Group, Circle, Canvas } from '@antv/react-g';
import LinkingEdge from './cells/LinkingEdge.js';
import React, { useContext, useState, useEffect, createRef } from 'react';
import { FlowModel } from './Model.js';
import { Renderer } from '@antv/g-canvas';
import { observer } from 'mobx-react';
import { computed, autorun } from 'mobx';
import { FlowContext } from './Context.js';
import { registComponents } from './utils/registComponents.js';
import { initClearState, initLink, initDrag, initSelect, initScale, initMultiSelect, initHotKeys } from './events.js';
import { STAGE_CLASS_NAME } from './constants.js';
import { getRightClickPanel } from './components/RightClickPanel/index.js';
import { color } from './theme/style.js';

const renderer = new Renderer();
const renderComponent = (cellData, model) => {
    return React.createElement(model.componentsMap.get(cellData.component) || Group, {
        data: cellData,
        key: cellData.id,
    });
};
const Dots = observer(() => {
    const model = useContext(FlowContext);
    // const EXTRA = model.grid as number;
    const EXTRA = 0;
    const _dots = computed(() => {
        const re = [];
        // @TODO
        for (let i = -EXTRA; i <= model.height() + EXTRA; i += model.grid) {
            for (let j = -EXTRA; j <= model.width() + EXTRA; j += model.grid) {
                re.push({
                    x: j,
                    y: i,
                });
            }
        }
        return re;
    }).get();
    return (React.createElement(Group, null, _dots.map((dot) => {
        return React.createElement(Circle, { x: dot.x, y: dot.y, r: 1, fill: color.deepGrey });
    })));
});
let Grid = class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.gridRef = React.createRef();
    }
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
    render() {
        const grid = this.context.grid;
        const _gridPos = computed(() => {
            return {
                x: -Math.round(this.context.x() / this.context.scale() / grid) * grid,
                y: -Math.round(this.context.y() / this.context.scale() / grid) * grid,
            };
        }).get();
        return (React.createElement(Group, Object.assign({}, _gridPos, { zIndex: 0, ref: this.gridRef, visible: !!(this.context.grid && this.context.scale() >= 1) }),
            React.createElement(Dots, null)));
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
    return (React.createElement(Group, { ref: linesLayerRef, zIndex: 1 }, edgesData.map((cellData) => {
        return renderComponent(cellData, model);
    })));
});
const Nodes = observer((props) => {
    const { nodesLayerRef, model } = props;
    const nodesData = model.canvasData.cells.filter((cellData) => {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Group, { ref: nodesLayerRef, zIndex: 2 }, nodesData.slice(0, nodesData.length).map((cellData) => {
        return renderComponent(cellData, model);
    })));
});
const InteractTop = observer((props) => {
    const { model, topLayerRef } = props;
    return (React.createElement(Group, { zIndex: 3, ref: topLayerRef },
        React.createElement(LinkingEdge, { data: model.buffer.link })));
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
        this.linesLayerRef.current;
        this.nodesLayerRef.current;
        this.topLayerRef.current;
        const { zoom = true, multiSelect = false } = this.props;
        initClearState(model, stage);
        initLink(model, stage);
        initDrag(model, stage);
        initSelect(model);
        zoom &&
            initScale(model, stage);
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
                React.createElement(Canvas, { renderer: renderer, className: STAGE_CLASS_NAME, ref: this.stageRef, width: model.width(), height: model.height() },
                    React.createElement(Group, { transform: `scale(${model.scale()}, ${model.scale()})`, x: model.x(), y: model.y() },
                        React.createElement(FlowContext.Provider, { value: model },
                            this.props.grid && React.createElement(Grid, null),
                            React.createElement(Nodes, { nodesLayerRef: this.nodesLayerRef, model: model }),
                            React.createElement(Edges, { linesLayerRef: this.linesLayerRef, model: model }),
                            React.createElement(InteractTop, { topLayerRef: this.topLayerRef, model: model })))))));
    }
};
Flow = __decorate([
    observer
], Flow);
var Flow$1 = Flow;

export { Flow$1 as default };
