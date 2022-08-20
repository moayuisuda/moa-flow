import { __extends, __decorate, __spreadArray, __assign } from './node_modules/tslib/tslib.es6.js';
import React, { useContext } from 'react';
import { LinkingEdge } from './cells/LinkingEdge.js';
import { FlowModel } from './Model.js';
import { observer } from 'mobx-react';
import { FlowContext } from './Context.js';
import './components/Arrow.js';
import { Interactor } from './components/Interacotr.js';
import './components/Port.js';
import { getContextMenu } from './components/ContextMenu/index.js';
import { SelectBoundsRect } from './components/SelectBoundsRect.js';
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
        throw "[moa-flow] component ".concat(cellData.component, " not regist.");
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
        throw "[moa-flow] component ".concat(cellData.component, " is not regist.");
    var cellModel = context.cellsModelMap.get(cellData.id);
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
var getViewBox = function (context) {
    return "".concat(-context.x, " ").concat(-context.y, " ").concat(context.width / context.scale, " ").concat(context.height / context.scale);
};
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        return _super.call(this, props) || this;
    }
    Grid.prototype.render = function () {
        var grid = this.context.grid;
        var context = this.context;
        var radius = 2;
        return (React.createElement(React.Fragment, null,
            React.createElement("defs", null,
                React.createElement("pattern", { id: "dot", x: -radius, y: -radius, width: grid, height: grid, patternUnits: "userSpaceOnUse" },
                    React.createElement("circle", { cx: radius, cy: radius, r: radius, fill: context.color.deepGrey }))),
            React.createElement("rect", { x: -this.context.x, y: -this.context.y, width: "100%", height: "100%", fill: "url(#dot)" })));
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
    return (React.createElement(React.Fragment, null, edgesData.map(function (cellData) { return (React.createElement(PositionWrapper, { cellData: cellData, key: cellData.id })); })));
});
var Nodes = observer(function () {
    var context = useContext(FlowContext);
    var nodesData = context.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement("div", { style: {
            zIndex: 1,
            position: "absolute",
            pointerEvents: "none",
            // 这里div的left和right是不受scale控制的，所以要额外*scale
            left: context.x * context.scale,
            top: context.y * context.scale,
            transform: "scale(".concat(context.scale, ", ").concat(context.scale, ")"),
            transformOrigin: "top left",
            width: context.width,
            height: context.height,
        }, ref: function (ref) { return (context.refs.divContainerRef = ref); } }, nodesData.slice(0, nodesData.length).map(function (cellData) { return (React.createElement(PositionWrapper, { cellData: cellData, key: cellData.id })); })));
});
var LinesAndInterect = observer(function () {
    var context = useContext(FlowContext);
    return (React.createElement("svg", { viewBox: getViewBox(context), style: {
            zIndex: 0,
            position: "absolute",
            pointerEvents: "none",
        }, ref: function (ref) { return (context.refs.svgContainerRef = ref); }, width: context.width, height: context.height },
        context.grid && React.createElement(Grid, null),
        React.createElement(Edges, null),
        React.createElement(LinkingEdge, { data: context.buffer.link }),
        React.createElement(SelectBoundsRect, null)));
});
var Flow = /** @class */ (function (_super) {
    __extends(Flow, _super);
    function Flow(props) {
        if (props === void 0) { props = {
            scale: true,
            multiSelect: false,
        }; }
        var _this = _super.call(this, props) || this;
        _this.flowModel = new FlowModel(props.onEvent);
        _this.flowModel.registModels(props.models || {});
        _this.flowModel.registComponents(props.components || {});
        _this.props.canvasData &&
            _this.flowModel.setCanvasData(_this.props.canvasData);
        _this.props.grid && (_this.flowModel.grid = _this.props.grid);
        if (_this.props.width && _this.props.height) {
            _this.flowModel.size = {
                width: _this.props.width,
                height: _this.props.height,
            };
        }
        _this.props.onLoad && _this.props.onLoad(_this.flowModel);
        props.modelRef && (props.modelRef.current = _this.flowModel);
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
            "scale",
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
            getContextMenu(this.props.children),
            React.createElement("div", __assign({ style: {
                    overflow: "hidden",
                    display: "inline-block",
                    position: "absolute",
                    width: model.width,
                    height: model.height,
                    cursor: model.hotKey["Space"] ? "move" : "auto",
                }, id: STAGE_ID, ref: function (ref) {
                    model.refs.stageRef = ref;
                } }, this.getEvents()),
                React.createElement(Nodes, null),
                React.createElement(LinesAndInterect, null))));
    };
    Flow = __decorate([
        observer
    ], Flow);
    return Flow;
}(React.Component));

export { Flow as default };
