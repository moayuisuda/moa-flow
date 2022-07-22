import { __extends, __decorate, __spreadArray, __assign, __awaiter, __generator } from './node_modules/tslib/tslib.es6.js';
import React, { useContext } from 'react';
import { LinkingEdge } from './cells/LinkingEdge.js';
import { FlowModel } from './Model.js';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { FlowContext } from './Context.js';
import './components/Arrow.js';
import { Interactor } from './components/Interacotr.js';
import './components/Port.js';
import { getContextMenu } from './components/ContextMenu/index.js';
import './components/SelectBoundsRect.js';
import { STAGE_ID } from './constants.js';
import { initEvents } from './events.js';

var PositionWrapper = observer(function (_a) {
    var cellData = _a.cellData;
    var isNode = cellData.cellType === "node";
    var context = useContext(FlowContext);
    var absolutePosition = isNode
        ? context.getNodePosition(cellData.id)
        : { x: 0, y: 0 };
    var Component = context.componentsMap.get(cellData.component);
    if (!Component)
        throw "[flow-infra] component ".concat(cellData.component, " is not regist.");
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
        children: React.createElement(CellComponent, { cellData: cellData }),
    });
});
var CellComponent = observer(function (_a) {
    var cellData = _a.cellData;
    var isNode = cellData.cellType === "node";
    var context = useContext(FlowContext);
    var Component = context.componentsMap.get(cellData.component);
    if (!Component)
        throw "[flow-infra] component ".concat(cellData.component, " is not regist.");
    var Model = context.modelFactoriesMap.get(cellData.component);
    var cellModel = new Model(cellData, context);
    context.cellsModelMap.set(cellData.id, cellModel);
    return React.createElement(Interactor, {
        key: cellData.id,
        id: cellData.id,
        inSvg: !isNode,
        children: React.createElement(Component, {
            model: cellModel,
            key: cellData.id,
        }),
    });
});
observer(function () {
    var model = useContext(FlowContext);
    // const EXTRA = model.grid as number;
    var EXTRA = 0;
    computed(function () {
        var re = [];
        for (var i = -EXTRA; i <= model.height + EXTRA; i += model.grid) {
            for (var j = -EXTRA; j <= model.width + EXTRA; j += model.grid) {
                re.push({
                    x: j,
                    y: i,
                });
            }
        }
        return re;
    }).get();
    return (React.createElement("div", null));
});
var getViewBox = function (context) {
    return "".concat(-context.x, " ").concat(-context.y, " ").concat(context.width / context.scale, " ").concat(context.height / context.scale);
};
/** @class */ ((function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.gridRef = React.createRef();
        return _this;
    }
    Grid.prototype.render = function () {
        var _this = this;
        var grid = this.context.grid;
        computed(function () {
            return {
                x: -Math.round(_this.context.x / _this.context.scale / grid) * grid,
                y: -Math.round(_this.context.y / _this.context.scale / grid) * grid,
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
        React.createElement(React.Fragment, null));
    };
    Grid.contextType = FlowContext;
    Grid = __decorate([
        observer
    ], Grid);
    return Grid;
})(React.Component));
var Edges = observer(function () {
    var context = useContext(FlowContext);
    var edgesData = context.canvasData.cells.filter(function (cellData) { return cellData.cellType === "edge"; });
    return (React.createElement(React.Fragment, null, edgesData.map(function (cellData) { return (React.createElement(PositionWrapper, { cellData: cellData, key: cellData.id })); })));
});
var Nodes = observer(function () {
    var context = useContext(FlowContext);
    var nodesData = context.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(React.Fragment, null, nodesData.slice(0, nodesData.length).map(function (cellData) { return (React.createElement(PositionWrapper, { cellData: cellData, key: cellData.id })); })));
});
var InteractTop = observer(function () {
    var context = useContext(FlowContext);
    return (React.createElement(React.Fragment, null,
        React.createElement(LinkingEdge, { data: context.buffer.link })));
});
var Flow = /** @class */ (function (_super) {
    __extends(Flow, _super);
    function Flow(props) {
        if (props === void 0) { props = {
            scale: true,
            multiSelect: false,
        }; }
        var _this = _super.call(this, props) || this;
        _this.componentDidMount = function () { return __awaiter(_this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                model = this.flowModel;
                model.refs.stageRef;
                this.props.canvasData &&
                    this.flowModel.setCanvasData(this.props.canvasData);
                return [2 /*return*/];
            });
        }); };
        _this.flowModel = new FlowModel(props.onEvent);
        _this.props.grid && (_this.flowModel.grid = _this.props.grid);
        if (_this.props.width && _this.props.height) {
            _this.flowModel.size = {
                width: _this.props.width,
                height: _this.props.height,
            };
        }
        _this.props.onLoad && _this.props.onLoad(_this.flowModel);
        props.modelRef && (props.modelRef.current = _this.flowModel);
        _this.flowModel.registComponents(props.components || {});
        return _this;
    }
    Flow.prototype.getEvents = function () {
        var _this = this;
        var extraEvents = ["scale", "multiSelect"];
        var defaultEvents = [
            "clearState",
            "link",
            "drag",
            "select",
            "hotkeys",
        ];
        var events = __spreadArray([], defaultEvents, true);
        extraEvents.forEach(function (event) {
            if (_this.props[event])
                events.push(event);
        });
        return initEvents(events, this.flowModel);
    };
    Flow.prototype.render = function () {
        var model = this.flowModel;
        return (React.createElement(FlowContext.Provider, { value: model },
            React.createElement("div", null,
                getContextMenu(this.props.children),
                React.createElement("div", __assign({ style: {
                        overflow: "hidden",
                        display: "inline-block",
                        position: "absolute",
                        width: model.width,
                        height: model.height,
                    }, id: STAGE_ID, ref: function (ref) {
                        model.refs.stageRef = ref;
                    } }, this.getEvents()),
                    React.createElement("div", { style: {
                            zIndex: 1,
                            position: "absolute",
                            left: model.x,
                            top: model.y,
                            transform: "scale(".concat(model.scale, ", ").concat(model.scale, ")"),
                            transformOrigin: "top left",
                            width: model.width,
                            height: model.height,
                        } },
                        React.createElement(Nodes, null)),
                    React.createElement("svg", { viewBox: getViewBox(model), style: {
                            zIndex: 0,
                            position: "absolute",
                            pointerEvents: "visiblePainted",
                        }, ref: function (ref) { return (model.refs.svgRef = ref); }, width: model.width, height: model.height },
                        React.createElement(Edges, null),
                        React.createElement(InteractTop, null))))));
    };
    Flow = __decorate([
        observer
    ], Flow);
    return Flow;
}(React.Component));

export { Flow as default };
