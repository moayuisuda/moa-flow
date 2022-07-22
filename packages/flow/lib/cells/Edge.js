import { __extends, __spreadArray, __assign } from '../node_modules/tslib/tslib.es6.js';
import React, { useContext } from 'react';
import { isVector2d, callIfFn } from '../utils/util.js';
import { lineCenter } from '../utils/vector.js';
import { CellModel } from './Cell.js';
import { FlowContext } from '../Context.js';
import '../node_modules/mobx-react-lite/es/index.js';
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
        _this.labelRef = React.createRef();
        _this.arrowRef = React.createRef();
        return _this;
    }
    EdgeModel.prototype.lineStyle = function (_a) {
        var isSelect = _a.isSelect;
        var color = this.context.color;
        if (isSelect) {
            return {
                stroke: color.active,
            };
        }
        else
            return {};
    };
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
    EdgeModel.prototype.labelContent = function () {
        var _a = this.context; _a.color; var svgRef = _a.refs.svgRef;
        var text = this.labelFormatter(this.data.label);
        if (!text)
            return React.createElement(React.Fragment, null);
        var props = __assign({ dominantBaseline: "hanging" }, this.labelStyle());
        var textInstance = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textInstance.innerHTML = text;
        svgRef.appendChild(textInstance);
        var textBounds = textInstance.getBBox();
        svgRef.removeChild(textInstance);
        return (React.createElement("g", { x: -(textBounds.width + LABEL_PADDING) / 2, y: -(TEXT_HEIGHT + LABEL_PADDING) / 2 },
            React.createElement("rect", { width: textBounds.width + LABEL_PADDING * 2, height: TEXT_HEIGHT + LABEL_PADDING * 2, fill: "white" }),
            React.createElement("text", __assign({ x: LABEL_PADDING, y: LABEL_PADDING }, props), text)));
    };
    EdgeModel.prototype.labelStyle = function () {
        return {};
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
    EdgeModel.prototype.labelPosition = function () {
        if (callIfFn(this.bazier)) {
            this.pathInstance.setAttribute("d", this.getBazierPath());
            console.log(this.pathInstance);
            return this.pathInstance.getPointAtLength(this.pathInstance.getTotalLength() / 2);
        }
        else {
            var points = this.getVectors().map(function (vector) { return [
                vector.x,
                vector.y,
            ]; });
            var lineLenthCenter = lineCenter(points);
            return {
                x: lineLenthCenter[0] || points[0][0],
                y: lineLenthCenter[1] || points[0][1],
            };
        }
    };
    EdgeModel.prototype.getPolylinePath = function () {
        var points = this.getPoints();
        var str = "M".concat(points[0][0], ",").concat(points[0][1]);
        for (var i = 1; i < points.length; i++) {
            str += "L".concat(points[i][0], ",").concat(points[i][1]);
        }
        return str;
    };
    EdgeModel.prototype.getPath = function () {
        return callIfFn(this.bazier)
            ? this.getBazierPath()
            : this.getPolylinePath();
    };
    EdgeModel.defaultData = {
        id: "",
        component: "Edge",
        source: "",
        target: "",
        label: "",
        verticies: [],
        cellType: "edge",
    };
    return EdgeModel;
}(CellModel));
var Edge = observer(function (_a) {
    var model = _a.model;
    var Line = observer(function () {
        var context = useContext(FlowContext);
        var color = context.color;
        var lineProps = __assign({ strokeLinecap: "round", strokeLinejoin: "round", fill: "none", strokeWidth: 3, stroke: color.deepGrey }, model.lineStyle({ isSelect: model.isSelect }));
        return (React.createElement("path", __assign({ ref: model.arrowRef }, lineProps, { d: model.getPath(), 
            // startHead={callIfFn(this.startHead)}
            // endHead={callIfFn(this.endHead)}
            strokeDasharray: callIfFn(model.lineDash) })));
    });
    var Label = observer(function () {
        var text = model.labelFormatter(model.data.label);
        var position = model.labelPosition();
        console.log("trasnlate(".concat(position.x, ", ").concat(position.y, ")"));
        return (React.createElement("g", { ref: function (label) {
                if (model.isMountEvents || !label)
                    return;
                model.isMountEvents = true;
            }, transform: "translate(".concat(position.x, ", ").concat(position.y, ")") }, text && model.labelContent()));
    });
    return (React.createElement("g", null,
        React.createElement(Line, null),
        React.createElement(Label, null)));
});

export { Edge, EdgeModel };
