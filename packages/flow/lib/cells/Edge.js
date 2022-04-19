import { __extends, __spreadArray, __assign } from '../node_modules/tslib/tslib.es6.js';
import Cell from './Cell.js';
import { Label, Tag, Text, Group, Line } from 'react-konva';
import Interactor from '../scaffold/Interactor.js';
import React from 'react';
import { isVector2d } from '../utils/util.js';

var TEXT_HEIGHT = 16;
var LABEL_PADDING = 4;
var Edge = /** @class */ (function (_super) {
    __extends(Edge, _super);
    function Edge(props, context) {
        var _this = _super.call(this, props, context) || this;
        // // 先不管线条的bounds
        // static getBounds(cellData) {
        //   const sourceInstance = flowModel.cellsMap.get(cellData.source);
        //   const targetInstance = flowModel.cellsMap.get(cellData.target);
        //   const sourceAnchor =
        //     sourceInstance.props.anchor && sourceInstance.props.anchor();
        //   // || sourceInstance.anchor();
        //   const targetAnchor =
        //     targetInstance.props.anchor && targetInstance.props.anchor();
        //   const left = Math.min(sourceAnchor.x, targetAnchor.x);
        //   const right = Math.max(sourceAnchor.x, targetAnchor.x);
        //   const top = Math.min(sourceAnchor.y, targetAnchor.y);
        //   const bottom = Math.max(sourceAnchor.y, targetAnchor.y);
        //   return {
        //     width: right - left,
        //     height: bottom - top,
        //     x: left,
        //     y: top,
        //   };
        // }
        _this.bazier = true;
        _this.dash = false;
        _this.getStroke = function (flowState) {
            var isSelect = flowState.isSelect;
            var color = _this.context.color;
            if (isSelect) {
                return {
                    stroke: color.active,
                };
            }
            else
                return {};
        };
        _this.formatVerticied = function (verticies) {
            return verticies;
        };
        _this.getAnchors = function () {
            var data = _this.props.data;
            var sourceAnchor;
            var targetAnchor;
            if (isVector2d(data.source))
                sourceAnchor = data.source;
            else {
                var sourceInstance = _this.context.cellsMap.get(data.source);
                sourceAnchor =
                    (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
                        sourceInstance.anchor();
            }
            if (isVector2d(data.target))
                targetAnchor = data.target;
            else {
                var targetInstance = _this.context.cellsMap.get(data.target);
                targetAnchor =
                    (targetInstance.props.anchor && targetInstance.props.anchor()) ||
                        targetInstance.anchor();
            }
            return {
                source: sourceAnchor,
                target: targetAnchor,
            };
        };
        _this.labelRef = React.createRef();
        _this.state = {
            points: [],
        };
        return _this;
    }
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
            re.push(vector.x, vector.y);
        });
        return re;
    };
    Edge.prototype.labelContent = function () {
        var _this = this;
        var _a = this.context, color = _a.color, linesLayerRef = _a.refs.linesLayerRef;
        var text = this.labelFormatter(this.props.data.label);
        var textWidth = linesLayerRef.current
            .getContext()
            .measureText(text).width;
        return (React.createElement(Label, { x: -textWidth / 2 - LABEL_PADDING, y: -TEXT_HEIGHT / 2, onClick: function (e) {
                _this.context.sendEvent({
                    type: "label:click",
                    data: _this,
                });
            } },
            React.createElement(Tag, { fill: color.background }),
            React.createElement(Text, { height: TEXT_HEIGHT, verticalAlign: "middle", text: this.labelFormatter(this.props.data.label), padding: LABEL_PADDING })));
    };
    Edge.prototype.labelRender = function (anchors) {
        var _this = this;
        var text = this.labelFormatter(this.props.data.label);
        return (React.createElement(Group, { ref: function (label) {
                if (!label)
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
                        _this.context.sendEvent({
                            type: "label:".concat(eventName),
                            data: {
                                e: e,
                                cellData: _this.props.data,
                            },
                        });
                    });
                });
            }, x: (anchors.source.x + anchors.target.x) / 2, y: (anchors.source.y + anchors.target.y) / 2 }, text && this.labelContent()));
    };
    Edge.prototype.labelFormatter = function (label) {
        return label;
    };
    Edge.prototype.isLinking = function () {
        return this.context.buffer.link.edge === this.props.data.id;
    };
    Edge.prototype.edgeRender = function (_a) {
        var points = _a.points, isLinking = _a.isLinking;
        var color = this.context.color;
        return (React.createElement(Group, null,
            React.createElement(Line, __assign({ stroke: color.deepGrey, points: points, strokeWidth: 3 }, this.getStroke(this.flowState), { lineCap: "round", dash: isLinking ? [10, 10] : undefined })),
            React.createElement(Line, { stroke: "transparent", points: points, strokeWidth: 20, lineCap: "round" }),
            this.lineExtra && this.lineExtra()));
    };
    Edge.prototype.content = function () {
        return (React.createElement(Interactor, { id: this.props.data.id, draggable: false },
            this.edgeRender({
                points: this.getPoints(),
                isLinking: this.isLinking(),
            }),
            this.labelRender(this.getAnchors())));
    };
    Edge.metaData = {
        cellType: "edge",
    };
    return Edge;
}(Cell));

export { Edge as default };
