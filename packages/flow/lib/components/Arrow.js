import { __extends, __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import '../node_modules/lodash/lodash.js';
import { Group, Path } from '@antv/react-g';
import React, { Component } from 'react';
import { l as lodash } from '../_virtual/lodash.js';
import { create, fromValues } from '../node_modules/gl-matrix/esm/vec3.js';

var ARROW_SIZE = 16;
/**
 * support 3 types of arrow line:
 * 1. Line
 * 2. Polyline
 * 3. Path
 *
 * support 2 types of arrow head:
 * 1. default(Path)
 * 2. custom
 */
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
        if (lodash.exports.isBoolean(head)) {
            return this.getDefaultArrowHead();
        }
        else {
            return isStart ? this.props.startHead : this.props.endHead;
        }
    };
    Arrow.prototype.setHeadTransform = function () {
        console.log("get");
        var _a = this.props, startHead = _a.startHead, endHead = _a.endHead;
        startHead &&
            this.transformArrowHead(this.startRef.current, true);
        endHead &&
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
    /**
     * transform arrow head according to arrow line
     */
    Arrow.prototype.transformArrowHead = function (head, isStart) {
        var position = create();
        var rad = 0;
        var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var y2 = 0;
        {
            var _a = this.getTangent(this.bodyRef.current, isStart), p1 = _a[0], p2 = _a[1];
            x1 = p1[0];
            y1 = p1[1];
            x2 = p2[0];
            y2 = p2[1];
            console.log("p1p2", p1, p2);
        }
        var x = x1 - x2;
        var y = y1 - y2;
        rad = Math.atan2(y, x);
        position = fromValues(x2, y2, 0);
        head.setLocalPosition(position);
        head.setLocalEulerAngles((rad * 180) / Math.PI);
    };
    Arrow.prototype.getTangent = function (path, isStart) {
        return isStart ? path.getStartTangent() : path.getEndTangent();
    };
    Arrow.prototype.getDefaultArrowHead = function () {
        var _a = this.props; _a.startHead; _a.endHead; var others = __rest(_a, ["startHead", "endHead"]);
        var sin = Math.sin, cos = Math.cos, PI = Math.PI;
        return (React.createElement(Path, __assign({}, others, { lineDash: undefined, fill: this.props.stroke, path: "M".concat(ARROW_SIZE * cos(PI / 6), ",").concat(ARROW_SIZE * sin(PI / 6), " L0,0 L").concat(ARROW_SIZE * cos(PI / 6), ",-").concat(ARROW_SIZE * sin(PI / 6), " Z") })));
    };
    return Arrow;
}(Component));

export { Arrow };
