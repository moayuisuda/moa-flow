import { __assign, __extends, __decorate, __awaiter, __generator } from './node_modules/tslib/tslib.es6.js';
import { Renderer } from '@antv/g-canvas';
import { Group, Circle, Canvas as Canvas$1 } from '@antv/react-g';
import React, { useContext, createRef } from 'react';
import LinkingEdge from './cells/LinkingEdge.js';
import { FlowModel } from './Model.js';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { FlowContext } from './Context.js';
import './components/Arrow.js';
import './components/Interacotr.js';
import './components/Port.js';
import './node_modules/react-dom/index.js';
import { getRightClickPanel } from './components/RightClickPanel/index.js';
import { SelectBoundsRect } from './components/SelectBoundsRect.js';
import { registComponents } from './utils/registComponents.js';
import { STAGE_ID } from './constants.js';
import { initClearState, initLink, initDrag, initSelect, initScale, initMultiSelect, initHotKeys } from './events.js';
import { color } from './theme/style.js';
import { getCanvas } from './utils/getElement.js';

var renderer = new Renderer();
var CellComponent = observer(function (_a) {
    var cellData = _a.cellData;
    var model = useContext(FlowContext);
    var absolutePosition = cellData.cellType === "node"
        ? model.getNodePosition(cellData.id)
        : { x: 0, y: 0 };
    return (React.createElement(Group, __assign({}, absolutePosition), React.createElement(model.componentsMap.get(cellData.component) || Group, {
        data: cellData,
        key: cellData.id,
        wrapperRef: model.getWrapperRef(cellData.id),
    })));
});
var Dots = observer(function () {
    var model = useContext(FlowContext);
    // const EXTRA = model.grid as number;
    var EXTRA = 0;
    var _dots = computed(function () {
        var re = [];
        // @TODO
        for (var i = -EXTRA; i <= model.height() + EXTRA; i += model.grid) {
            for (var j = -EXTRA; j <= model.width() + EXTRA; j += model.grid) {
                re.push({
                    x: j,
                    y: i,
                });
            }
        }
        return re;
    }).get();
    return (React.createElement(Group, null, _dots.map(function (dot) {
        return React.createElement(Circle, { cx: dot.x, cy: dot.y, r: 2, fill: color.deepGrey });
    })));
});
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.gridRef = React.createRef();
        return _this;
    }
    Grid.prototype.render = function () {
        var _this = this;
        var grid = this.context.grid;
        var _gridPos = computed(function () {
            return {
                x: -Math.round(_this.context.x() / _this.context.scale() / grid) * grid,
                y: -Math.round(_this.context.y() / _this.context.scale() / grid) * grid,
            };
        }).get();
        return (React.createElement(Group, __assign({}, _gridPos, { zIndex: 0, ref: this.gridRef, visibility: this.context.grid && this.context.scale() >= 1 ? "visible" : "hidden" }),
            React.createElement(Dots, null)));
    };
    Grid.contextType = FlowContext;
    Grid = __decorate([
        observer
    ], Grid);
    return Grid;
}(React.Component));
var Edges = observer(function () {
    var context = useContext(FlowContext);
    var edgesData = context.canvasData.cells.filter(function (cellData) { return cellData.cellType === "edge"; });
    return (React.createElement(Group, { zIndex: 1 }, edgesData.map(function (cellData) { return (React.createElement(CellComponent, { cellData: cellData, key: cellData.id })); })));
});
var Nodes = observer(function () {
    var context = useContext(FlowContext);
    var nodesData = context.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Group, { zIndex: 2 }, nodesData.slice(0, nodesData.length).map(function (cellData) { return (React.createElement(CellComponent, { cellData: cellData, key: cellData.id })); })));
});
var InteractTop = observer(function () {
    var context = useContext(FlowContext);
    return (React.createElement(Group, { zIndex: 3 },
        React.createElement(LinkingEdge, { data: context.buffer.link }),
        React.createElement(SelectBoundsRect, null)));
});
var Flow = /** @class */ (function (_super) {
    __extends(Flow, _super);
    function Flow(props) {
        var _this = _super.call(this, props) || this;
        _this.componentDidMount = function () { return __awaiter(_this, void 0, void 0, function () {
            var model, stage, _a, _b, zoom, _c, multiSelect;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        model = this.flowModel;
                        stage = this.stageRef.current;
                        _a = this.props, _b = _a.zoom, zoom = _b === void 0 ? true : _b, _c = _a.multiSelect, multiSelect = _c === void 0 ? false : _c;
                        initClearState(model, stage);
                        initLink(model, stage);
                        initDrag(model, stage);
                        initSelect(model);
                        zoom && initScale(model, stage);
                        multiSelect && initMultiSelect(model, stage);
                        initHotKeys(model, stage);
                        initHotKeys(model, stage);
                        //@TODO 看下为啥这个appendChild就要await，jsx中的就不需要
                        return [4 /*yield*/, ((_d = this.stageRef.current) === null || _d === void 0 ? void 0 : _d.ready)];
                    case 1:
                        //@TODO 看下为啥这个appendChild就要await，jsx中的就不需要
                        _e.sent();
                        this.props.canvasData &&
                            this.flowModel.setCanvasData(this.props.canvasData);
                        return [2 /*return*/];
                }
            });
        }); };
        _this.flowModel = new FlowModel(props.onEvent);
        _this.props.grid && _this.flowModel.setGrid(_this.props.grid);
        if (_this.props.width && _this.props.height) {
            _this.flowModel.setSize(_this.props.width, _this.props.height);
        }
        _this.props.onLoad && _this.props.onLoad(_this.flowModel);
        props.modelRef && (props.modelRef.current = _this.flowModel);
        var refs = _this.flowModel.refs;
        _this.stageRef = refs.stageRef = createRef();
        registComponents(_this.flowModel);
        return _this;
    }
    Flow.prototype.render = function () {
        var model = this.flowModel;
        return (React.createElement("div", { style: {
                overflow: "hidden",
                position: "relative",
                display: "inline-block",
            }, id: STAGE_ID },
            React.createElement(FlowContext.Provider, { value: model },
                getRightClickPanel(this.props.children),
                React.createElement(Canvas$1, { renderer: renderer, ref: this.stageRef, width: model.width(), height: model.height() },
                    React.createElement(Group, { transform: "scale(".concat(model.scale(), ", ").concat(model.scale(), ")"), 
                        // @ts-ignore
                        x: model.x(), y: model.y() },
                        React.createElement(FlowContext.Provider, { value: model },
                            model.grid && React.createElement(Grid, null),
                            getCanvas(this.props.children)))))));
    };
    Flow = __decorate([
        observer
    ], Flow);
    return Flow;
}(React.Component));
var Canvas = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Nodes, null),
        React.createElement(Edges, null),
        React.createElement(InteractTop, null)));
};

export { Canvas, Flow as default };
