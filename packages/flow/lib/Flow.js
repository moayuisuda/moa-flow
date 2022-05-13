import { __extends, __assign, __decorate } from './node_modules/tslib/tslib.es6.js';
import { Group, Circle, Canvas as Canvas$1 } from '@antv/react-g';
import LinkingEdge from './cells/LinkingEdge.js';
import React, { useContext, useState, useEffect, createRef } from 'react';
import { FlowModel } from './Model.js';
import { Renderer } from '@antv/g-canvas';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { FlowContext } from './Context.js';
import { registComponents } from './utils/registComponents.js';
import './components/Arrow.js';
import './components/Interacotr.js';
import './components/Port.js';
import './node_modules/react-dom/index.js';
import { getRightClickPanel } from './components/RightClickPanel/index.js';
import { SelectBoundsRect } from './components/SelectBoundsRect.js';
import { initClearState, initLink, initDrag, initSelect, initScale, initMultiSelect, initHotKeys } from './events.js';
import { STAGE_ID } from './constants.js';
import { color } from './theme/style.js';
import { getCanvas } from './utils/getElement.js';

var renderer = new Renderer();
var renderComponent = function (cellData, model) {
    return React.createElement(model.componentsMap.get(cellData.component) || Group, {
        data: cellData,
        key: cellData.id,
    });
};
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
        return React.createElement(Circle, { x: dot.x, y: dot.y, r: 1, fill: color.deepGrey });
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
    var _a = useState(0); _a[0]; var setSecondRefresh = _a[1];
    useEffect(function () {
        setSecondRefresh(1);
    }, []);
    var edgesData = context.canvasData.cells.filter(function (cellData) { return cellData.cellType === "edge"; });
    return (React.createElement(Group, { zIndex: 1 }, edgesData.map(function (cellData) {
        return renderComponent(cellData, context);
    })));
});
var Nodes = observer(function () {
    var context = useContext(FlowContext);
    var nodesData = context.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Group, { zIndex: 2 }, nodesData.slice(0, nodesData.length).map(function (cellData) {
        return renderComponent(cellData, context);
    })));
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
        _this.flowModel = new FlowModel(props.onEvent);
        _this.props.canvasData &&
            _this.flowModel.setCanvasData(_this.props.canvasData);
        _this.props.grid && _this.flowModel.setGrid(_this.props.grid);
        if (_this.props.width && _this.props.height) {
            _this.flowModel.setSize(_this.props.width, _this.props.height);
        }
        props.modelRef && (props.modelRef.current = _this.flowModel);
        props.onLoad && props.onLoad(_this.flowModel);
        var refs = _this.flowModel.refs;
        _this.stageRef = refs.stageRef = createRef();
        registComponents(_this.flowModel);
        return _this;
    }
    Flow.prototype.componentDidMount = function () {
        var model = this.flowModel;
        var stage = this.stageRef.current;
        var _a = this.props, _b = _a.zoom, zoom = _b === void 0 ? true : _b, _c = _a.multiSelect, multiSelect = _c === void 0 ? false : _c;
        initClearState(model, stage);
        initLink(model, stage);
        initDrag(model, stage);
        initSelect(model);
        zoom && initScale(model, stage);
        multiSelect && initMultiSelect(model, stage);
        initHotKeys(model, stage);
        initHotKeys(model, stage);
    };
    Flow.prototype.render = function () {
        var model = this.flowModel;
        return (React.createElement("div", { style: {
                position: "relative",
                display: "inline-block",
            }, id: STAGE_ID },
            React.createElement(FlowContext.Provider, { value: model },
                getRightClickPanel(this.props.children),
                React.createElement(Canvas$1, { renderer: renderer, ref: this.stageRef, width: model.width(), height: model.height() },
                    React.createElement(Group, { transform: "scale(".concat(model.scale(), ", ").concat(model.scale(), ")"), x: model.x(), y: model.y() },
                        React.createElement(FlowContext.Provider, { value: model },
                            this.props.grid && React.createElement(Grid, null),
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
