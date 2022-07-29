import { __extends, __spreadArray, __assign, __decorate } from '../node_modules/tslib/tslib.es6.js';
import React, { useContext } from 'react';
import { isVector2d, callIfFn } from '../utils/util.js';
import { CellModel } from './Cell.js';
import { FlowContext } from '../Context.js';
import '../node_modules/mobx-react-lite/es/index.js';
import { computed } from 'mobx';
import { observer } from '../node_modules/mobx-react-lite/es/observer.js';

var TEXT_HEIGHT = 16;
var LABEL_PADDING = 4;
var EdgeModel = /** @class */ (function (_super) {
    __extends(EdgeModel, _super);
    function EdgeModel(data, context) {
        var _this = _super.call(this, data, context) || this;
        _this.bazier = true;
        _this.startHead = false;
        _this.endHead = true;
        _this.lineDash = [0, 0];
        _this.animate = false;
        _this.pathInstance = document.createElementNS("http://www.w3.org/2000/svg", "path");
        _this.isMountEvents = false;
        _this.formatVerticied = function (verticies) {
            return verticies;
        };
        _this.getLinkPortsData = function () {
            return {
                source: isVector2d(_this.data.source)
                    ? _this.data.source
                    : _this.context.cellsDataMap.get(_this.data.source),
                target: isVector2d(_this.data.target)
                    ? _this.data.target
                    : _this.context.cellsDataMap.get(_this.data.target),
            };
        };
        _this.getAnchors = function () {
            var sourceAnchor;
            var targetAnchor;
            if (isVector2d(_this.data.source))
                sourceAnchor = _this.data.source;
            else {
                var sourceInstance = _this.context.cellsMap.get(_this.data.source);
                sourceAnchor = sourceInstance.anchor();
            }
            if (isVector2d(_this.data.target))
                targetAnchor = _this.data.target;
            else {
                var targetInstance = _this.context.cellsMap.get(_this.data.target);
                targetAnchor = targetInstance.anchor();
            }
            return {
                source: sourceAnchor,
                target: targetAnchor,
            };
        };
        return _this;
    }
    EdgeModel.prototype.getPoints = function () {
        var routeResult = this.route(this.getVectors());
        return this.vectorsToPoints(routeResult);
    };
    EdgeModel.prototype.getVectors = function () {
        var anchors = this.getAnchors();
        var verticies = this.data.verticies || [];
        return __spreadArray(__spreadArray([anchors.source], verticies, true), [anchors.target], false);
    };
    EdgeModel.prototype.getLinkNodesData = function () {
        var data = this.data;
        var source;
        var target;
        if (!isVector2d(data.source)) {
            var sourcePort = this.context.cellsMap.get(data.source);
            source = this.context.cellsMap.get(sourcePort.host);
        }
        if (!isVector2d(data.target)) {
            var targetPort = this.context.cellsDataMap.get(data.target);
            target = this.context.cellsDataMap.get(targetPort.host);
        }
        return {
            source: source,
            target: target,
        };
    };
    // 这个方法暴露出去，可自定义路由
    EdgeModel.prototype.route = function (vectors) {
        return vectors;
    };
    EdgeModel.prototype.vectorsToPoints = function (vectors) {
        var re = [];
        vectors.forEach(function (vector) {
            re.push([vector.x, vector.y]);
        });
        return re;
    };
    EdgeModel.prototype.getPointAt = function (ratio) {
        this.pathInstance.setAttribute("d", this.getBazierPath());
        return this.pathInstance.getPointAtLength(ratio * this.pathInstance.getTotalLength());
    };
    EdgeModel.prototype.labelContent = function () {
        var _a = this.context; _a.color; var svgContainerRef = _a.refs.svgContainerRef;
        var text = this.labelFormatter(this.data.label);
        if (!text)
            return React.createElement(React.Fragment, null);
        var props = {
            dominantBaseline: "hanging",
        };
        var textInstance = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textInstance.innerHTML = text;
        svgContainerRef.appendChild(textInstance);
        var textBounds = textInstance.getBBox();
        svgContainerRef.removeChild(textInstance);
        return (React.createElement("g", { transform: "translate(".concat(-(textBounds.width + LABEL_PADDING) / 2, ", ").concat(-(TEXT_HEIGHT + LABEL_PADDING) / 2, ")") },
            React.createElement("rect", { width: textBounds.width + LABEL_PADDING * 2, height: TEXT_HEIGHT + LABEL_PADDING * 2, fill: "white" }),
            React.createElement("text", __assign({ x: LABEL_PADDING, y: LABEL_PADDING }, props), text)));
    };
    EdgeModel.prototype.labelFormatter = function (label) {
        return "label + asd";
    };
    EdgeModel.prototype.isLinking = function () {
        return this.state.isLinking;
    };
    EdgeModel.prototype.getBazierDir = function () {
        var _a = this.getAnchors(), source = _a.source, target = _a.target;
        var LENGTH = (target.x - source.x) * 0.5;
        return {
            source: [LENGTH, 0],
            target: [-LENGTH, 0],
        };
    };
    EdgeModel.prototype.getBazierPath = function () {
        var _a = this.getAnchors(), source = _a.source, target = _a.target;
        var dir = this.getBazierDir();
        return "M".concat(source.x, ",").concat(source.y, " \n    C").concat(source.x + dir.source[0], ",").concat(source.y + dir.source[1], " ").concat(target.x + dir.target[0], ",").concat(target.y + dir.target[1], " \n    ").concat(target.x, ",").concat(target.y);
    };
    EdgeModel.prototype.getPolylinePath = function () {
        var points = this.getPoints();
        var str = "M".concat(points[0][0], ",").concat(points[0][1]);
        for (var i = 1; i < points.length; i++) {
            str += "L".concat(points[i][0], ",").concat(points[i][1]);
        }
        return str;
    };
    Object.defineProperty(EdgeModel.prototype, "d", {
        get: function () {
            return callIfFn(this.bazier)
                ? this.getBazierPath()
                : this.getPolylinePath();
        },
        enumerable: false,
        configurable: true
    });
    EdgeModel.defaultData = {
        id: "",
        component: "Edge",
        source: "",
        target: "",
        label: "",
        verticies: [],
        cellType: "edge",
    };
    __decorate([
        computed
    ], EdgeModel.prototype, "d", null);
    return EdgeModel;
}(CellModel));
var DEFAULT_ARROW_SIZE = 4;
var Edge = observer(function (_a) {
    var model = _a.model;
    var Line = observer(function () {
        var context = useContext(FlowContext);
        var color = context.color;
        var d = model.d, isSelect = model.isSelect;
        var lineProps = {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
            strokeWidth: 2,
            stroke: isSelect ? color.active : color.deepGrey,
        };
        var cos = Math.cos, sin = Math.sin, PI = Math.PI;
        var arrowOffset = [
            lineProps.strokeWidth / 2 || 0,
            lineProps.strokeWidth / 2 || 0,
        ];
        return (React.createElement(React.Fragment, null,
            React.createElement("defs", null,
                React.createElement("marker", { id: "arrow-end", markerWidth: "100", markerHeight: "100", refX: arrowOffset[0] + DEFAULT_ARROW_SIZE * cos(PI / 6), refY: arrowOffset[1] + DEFAULT_ARROW_SIZE * sin(PI / 6), orient: "auto" },
                    React.createElement("path", __assign({}, lineProps, { d: "M".concat(arrowOffset[0], ",").concat(arrowOffset[1], " L").concat(arrowOffset[0], ",").concat(DEFAULT_ARROW_SIZE * sin(PI / 6) * 2 + arrowOffset[1], " L").concat(DEFAULT_ARROW_SIZE * cos(PI / 6) + arrowOffset[0], ",").concat(DEFAULT_ARROW_SIZE * sin(PI / 6) + arrowOffset[1], " Z") })))),
            React.createElement("path", __assign({}, lineProps, { d: d, markerEnd: "url(#arrow-end)" }))));
    });
    var Label = observer(function () {
        var text = model.labelFormatter(model.data.label);
        var position = model.getPointAt(0.5);
        return (React.createElement("g", { ref: function (label) {
                if (model.isMountEvents || !label)
                    return;
                model.isMountEvents = true;
            }, transform: "translate(".concat(position.x, ", ").concat(position.y, ")") }, text && model.labelContent()));
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Line, null),
        React.createElement(Label, null)));
});

export { Edge, EdgeModel };
