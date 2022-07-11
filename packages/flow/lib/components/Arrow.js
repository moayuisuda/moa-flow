import { __extends, __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import { isBoolean } from '@antv/g';
import React, { Component } from 'react';
import { Group, Path } from '@antv/react-g';
import { fromValues } from '../node_modules/gl-matrix/esm/vec3.js';

var DEFAULT_ARROW_SIZE = 16;
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(props) {
        var _this = _super.call(this, props) || this;
        _this.startRef = React.createRef();
        _this.endRef = React.createRef();
        _this.bodyRef = React.createRef();
        return _this;
    }
    Arrow.prototype.getArrowHead = function (head, isStart) {
        if (isBoolean(head)) {
            return this.getDefaultArrowHead();
        }
        else {
            return isStart ? this.props.startHead : this.props.endHead;
        }
    };
    Arrow.prototype.setHeadTransform = function () {
        var _a = this.props, startHead = _a.startHead, endHead = _a.endHead;
        if (startHead)
            this.transformArrowHead(this.startRef.current, true);
        if (endHead)
            this.transformArrowHead(this.endRef.current, false);
    };
    Arrow.prototype.componentDidMount = function () {
        this.setHeadTransform();
    };
    Arrow.prototype.componentDidUpdate = function () {
        this.setHeadTransform();
    };
    Arrow.prototype.render = function () {
        var _a = this.props, startHead = _a.startHead, endHead = _a.endHead, others = __rest(_a, ["startHead", "endHead"]);
        return (React.createElement(Group, null,
            React.createElement(Path, __assign({}, others, { ref: this.bodyRef })),
            startHead && (React.createElement(Group, { ref: this.startRef }, this.getArrowHead(startHead, true))),
            endHead && (React.createElement(Group, { ref: this.endRef }, this.getArrowHead(endHead, false)))));
    };
    Arrow.prototype.getCenter = function () {
        var points = this.bodyRef.current.getPoint(0.5);
        return points;
    };
    // transform arrow head to match line tangent
    Arrow.prototype.transformArrowHead = function (head, isStart) {
        var _a = this.getTangent(this.bodyRef.current, isStart), p1 = _a[0], p2 = _a[1];
        var x1 = p1[0], y1 = p1[1];
        var x2 = p2[0], y2 = p2[1];
        var x = x1 - x2;
        var y = y1 - y2;
        var rad = Math.atan2(y, x) + Math.PI;
        var position = fromValues(x2, y2, 0);
        head.setLocalPosition(position);
        head.setLocalEulerAngles((rad * 180) / Math.PI);
    };
    Arrow.prototype.getTangent = function (path, isStart) {
        return isStart ? path.getStartTangent() : path.getEndTangent();
    };
    Arrow.prototype.getDefaultArrowHead = function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var _a = this.props; _a.startHead; _a.endHead; var others = __rest(_a, ["startHead", "endHead"]);
        var sin = Math.sin, cos = Math.cos, PI = Math.PI;
        return (React.createElement(Path, __assign({}, others, { lineDash: undefined, fill: this.props.stroke, path: "M-".concat(DEFAULT_ARROW_SIZE * cos(PI / 6), ",").concat(DEFAULT_ARROW_SIZE * sin(PI / 6), " L0,0 L-").concat(DEFAULT_ARROW_SIZE * cos(PI / 6), ",-").concat(DEFAULT_ARROW_SIZE * sin(PI / 6), " Z") })));
    };
    return Arrow;
}(Component));

export { Arrow };
