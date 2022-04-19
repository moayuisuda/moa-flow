import { __extends, __decorate } from './node_modules/tslib/tslib.es6.js';
import { Layer, Group, Stage, useStrictMode } from 'react-konva';
import LinkingEdge from './cells/LinkingEdge.js';
import React, { useState, useEffect, createRef } from 'react';
import { FlowModel } from './Model.js';
import { observer } from 'mobx-react';
import { FlowContext } from './Context.js';
import { registComponents } from './utils/registComponents.js';
import SelectBoundsRect from './scaffold/SelectBoundsRect.js';
import { initClearState, initLink, initDrag, initScale, initSelect, initHotKeys } from './events.js';
import { STAGE_CLASS_NAME } from './constants.js';
import { getRightClickPanel } from './components/RightClickPanel/index.js';

var renderComponent = function (cellData, model) {
    return React.createElement(model.componentsMap.get(cellData.component) || Group, {
        data: cellData,
        key: cellData.id,
    });
};
var Nodes = observer(function (props) {
    var nodesLayerRef = props.nodesLayerRef, model = props.model;
    var nodesData = model.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Layer, { ref: nodesLayerRef, zIndex: 1 }, nodesData.slice(0, nodesData.length).map(function (cellData) {
        return renderComponent(cellData, model);
    })));
});
var InteractTop = observer(function (props) {
    var model = props.model, topLayerRef = props.topLayerRef;
    model.canvasData.cells.filter(function (cellData) {
        return cellData.cellType !== "edge";
    });
    return (React.createElement(Layer, { zIndex: 2, ref: topLayerRef },
        React.createElement(LinkingEdge, { data: model.buffer.link }),
        React.createElement(SelectBoundsRect, null)));
});
var Edges = observer(function (props) {
    var linesLayerRef = props.linesLayerRef, model = props.model;
    var _a = useState(0); _a[0]; var setSecondRefresh = _a[1];
    useEffect(function () {
        setSecondRefresh(1);
    }, []);
    var edgesData = model.canvasData.cells.filter(function (cellData) { return cellData.cellType === "edge"; });
    return (React.createElement(Layer, { ref: linesLayerRef, zIndex: 0 }, edgesData.map(function (cellData) {
        return renderComponent(cellData, model);
    })));
});
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(props) {
        var _this = _super.call(this, props) || this;
        // 完全受控，https://github.com/konvajs/react-konva/blob/master/README.md#strict-mode
        useStrictMode(true);
        var refs = _this.props.model.refs;
        _this.stageRef = refs.stageRef = createRef();
        _this.nodesLayerRef = refs.nodesLayerRef = createRef();
        _this.linesLayerRef = refs.linesLayerRef = createRef();
        _this.topLayerRef = createRef();
        return _this;
        // 第一次渲染zIndex失效，issue link https://github.com/konvajs/react-konva/issues/194
    }
    Canvas.prototype.componentDidMount = function () {
        var model = this.props.model;
        var stage = this.stageRef.current;
        var linesLayer = this.linesLayerRef.current;
        var nodesLayer = this.nodesLayerRef.current;
        var topLayer = this.topLayerRef.current;
        initClearState(model, stage);
        initLink(model, stage);
        initDrag(model, stage, {
            linesLayer: linesLayer,
            nodesLayer: nodesLayer,
            topLayer: topLayer,
        });
        initScale(model, stage, {
            linesLayer: linesLayer,
            nodesLayer: nodesLayer,
        });
        initSelect(model, stage, {
            linesLayer: linesLayer,
            nodesLayer: nodesLayer,
            topLayer: topLayer,
        });
        initHotKeys(model, stage);
    };
    Canvas.prototype.render = function () {
        var model = this.props.model;
        return (React.createElement(Stage, { className: STAGE_CLASS_NAME, ref: this.stageRef, scale: model.canvasData.scale, x: model.canvasData.x, y: model.canvasData.y, width: this.props.width || window.innerWidth, height: this.props.height || window.innerHeight },
            React.createElement(FlowContext.Provider, { value: model },
                React.createElement(Nodes, { nodesLayerRef: this.nodesLayerRef, model: model }),
                React.createElement(InteractTop, { topLayerRef: this.topLayerRef, model: model }),
                React.createElement(Edges, { linesLayerRef: this.linesLayerRef, model: model }))));
    };
    Canvas = __decorate([
        observer
    ], Canvas);
    return Canvas;
}(React.Component));
var DEFAULT_CANVAS_DATA = {
    scale: { x: 1, y: 1 },
    x: 0,
    y: 0,
    cells: [],
};
var Flow = /** @class */ (function (_super) {
    __extends(Flow, _super);
    function Flow(props) {
        var _this = _super.call(this, props) || this;
        _this.flowModel = new FlowModel(props.onEvent);
        _this.flowModel.setCanvasData(_this.props.canvasData || DEFAULT_CANVAS_DATA);
        props.modelRef && (props.modelRef.current = _this.flowModel);
        props.onLoad && props.onLoad(_this.flowModel);
        registComponents(_this.flowModel);
        return _this;
    }
    Flow.prototype.render = function () {
        var model = this.flowModel;
        return (React.createElement("div", { style: {
                position: "relative",
            } },
            React.createElement(FlowContext.Provider, { value: model },
                getRightClickPanel(this.props.children),
                React.createElement(Canvas, { model: model, width: this.props.width, height: this.props.height }))));
    };
    Flow = __decorate([
        observer
    ], Flow);
    return Flow;
}(React.Component));

export { Flow as default };
