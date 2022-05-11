import { __extends, __spreadArray, __assign } from '../node_modules/tslib/tslib.es6.js';
import Cell from './Cell.js';
import { Group, Rect, Text } from '@antv/react-g';
import * as G from '@antv/g';
import Interactor from '../scaffold/Interacotr.js';
import React from 'react';
import { isVector2d } from '../utils/util.js';
import { titleCase } from '../utils/string.js';
import { lineCenter } from '../utils/vector.js';
import Arrow from '../components/Arrow.js';

var TEXT_HEIGHT = 16;
var LABEL_PADDING = 4;
var Edge = /** @class */ (function (_super) {
    __extends(Edge, _super);
    function Edge(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.bazier = false;
        _this.arrow = false;
        _this.isMountEvents = false;
        _this.formatVerticied = function (verticies) {
            return verticies;
        };
        _this.getLinkPortsData = function () {
            return {
                source: isVector2d(_this.props.data.source)
                    ? _this.props.data.source
                    : _this.context.cellsDataMap.get(_this.props.data.source),
                target: isVector2d(_this.props.data.target)
                    ? _this.props.data.target
                    : _this.context.cellsDataMap.get(_this.props.data.target),
            };
        };
        _this.getAnchors = function () {
            var data = _this.props.data;
            var sourceAnchor;
            var targetAnchor;
            if (isVector2d(data.source))
                sourceAnchor = data.source;
            else {
                var sourceInstance = _this.context.cellsMap.get(data.source);
                sourceAnchor = sourceInstance.anchor();
            }
            if (isVector2d(data.target))
                targetAnchor = data.target;
            else {
                var targetInstance = _this.context.cellsMap.get(data.target);
                targetAnchor = targetInstance.anchor();
            }
            return {
                source: sourceAnchor,
                target: targetAnchor,
            };
        };
        _this.labelRef = React.createRef();
        return _this;
    }
    Edge.prototype.lineStyle = function (_a) {
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
    Edge.prototype.getPoints = function () {
        var routeResult = this.route(this.getVectors());
        return this.vectorsToPoints(routeResult);
    };
    Edge.prototype.getVectors = function () {
        var anchors = this.getAnchors();
        var verticies = this.props.data.verticies || [];
        return __spreadArray(__spreadArray([anchors.source], verticies, true), [anchors.target], false);
    };
    Edge.prototype.getLinkNodesData = function () {
        var data = this.props.data;
        var source;
        var target;
        if (!isVector2d(data.source)) {
            var sourcePort = this.context.cellsDataMap.get(data.source);
            source = this.context.cellsDataMap.get(sourcePort.host);
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
    Edge.prototype.route = function (vectors) {
        return vectors;
    };
    Edge.prototype.vectorsToPoints = function (vectors) {
        var re = [];
        vectors.forEach(function (vector) {
            re.push([vector.x, vector.y]);
        });
        return re;
    };
    Edge.prototype.labelContent = function () {
        var _a, _b;
        var _c = this.context; _c.color; var stageRef = _c.refs.stageRef;
        var text = this.labelFormatter(this.props.data.label);
        if (!text)
            return React.createElement(React.Fragment, null);
        var props = __assign({ text: text, textBaseline: "top" }, this.labelStyle());
        var textInstance = new G.Text({
            style: props,
        });
        (_a = stageRef === null || stageRef === void 0 ? void 0 : stageRef.current) === null || _a === void 0 ? void 0 : _a.appendChild(textInstance);
        var textBounds = textInstance.getBBox();
        (_b = stageRef === null || stageRef === void 0 ? void 0 : stageRef.current) === null || _b === void 0 ? void 0 : _b.removeChild(textInstance);
        return (React.createElement(Group, { x: -(textBounds.width + LABEL_PADDING) / 2, y: -(TEXT_HEIGHT + LABEL_PADDING) / 2 },
            React.createElement(Rect, { width: textBounds.width + LABEL_PADDING * 2, height: TEXT_HEIGHT + LABEL_PADDING * 2, fill: "white" }),
            React.createElement(Text, __assign({ x: LABEL_PADDING, y: LABEL_PADDING }, props))));
    };
    Edge.prototype.labelStyle = function () {
        return {};
    };
    Edge.prototype.labelPosition = function () {
        var points = this.getVectors().map(function (vector) { return [vector.x, vector.y]; });
        var lineLenthCenter = lineCenter(points);
        return {
            x: lineLenthCenter[0] || points[0][0],
            y: lineLenthCenter[1] || points[0][1],
        };
    };
    Edge.prototype.labelRender = function () {
        var _this = this;
        var text = this.labelFormatter(this.props.data.label);
        return (React.createElement(Group, __assign({ ref: function (label) {
                if (_this.isMountEvents || !label)
                    return;
                [
                    "mouseenter",
                    "mouseleave",
                    "mousedown",
                    "mouseup",
                    "dblclick",
                    "click",
                ].forEach(function (eventName) {
                    label.on(eventName, function (e) {
                        var instanceEventFn = _this["onLabel".concat(titleCase(eventName))];
                        instanceEventFn && instanceEventFn.call(_this, e);
                        _this.context.sendEvent({
                            type: "label:".concat(eventName),
                            data: {
                                e: e,
                                cellData: _this.props.data,
                                cell: _this,
                            },
                        });
                    });
                });
                _this.isMountEvents = true;
            } }, this.labelPosition()), text && this.labelContent()));
    };
    Edge.prototype.labelFormatter = function (label) {
        return label;
    };
    Edge.prototype.isLinking = function () {
        return this.props.data.$state.isLinking;
    };
    Edge.prototype.getBazierPath = function () {
        var _a = this.getAnchors(), source = _a.source, target = _a.target;
        var LENGTH = (source.x - target.x) * 0.5;
        return "M".concat(source.x, ",").concat(source.y, " \n    C").concat(source.x - LENGTH, ",").concat(source.y, " ").concat(target.x + LENGTH, ",").concat(target.y, " \n    ").concat(target.x, ",").concat(target.y);
    };
    Edge.prototype.edgeRender = function (_a) {
        var points = _a.points; _a.isLinking;
        var color = this.context.color;
        var lineProps = __assign({ lineCap: "round", lineJoin: "round", lineWidth: 3, stroke: color.deepGrey }, this.lineStyle({ isSelect: this.isSelect() }));
        var bazierProps = {
            type: "Path",
            path: this.getBazierPath(),
        };
        var polyLineProps = {
            type: "Polyline",
            points: points,
        };
        return (React.createElement(Group, null,
            React.createElement(Arrow, __assign({}, (this.bazier ? bazierProps : polyLineProps), { points: points }, lineProps, { endHead: true }))));
    };
    Edge.prototype.content = function () {
        return (React.createElement(Interactor, { id: this.props.data.id, draggable: false },
            this.edgeRender({
                points: this.getPoints(),
                isLinking: this.isLinking(),
            }),
            this.labelRender(),
            this.lineExtra && this.lineExtra()));
    };
    Edge.metaData = {
        cellType: "edge",
    };
    return Edge;
}(Cell));

export { Edge as default };
