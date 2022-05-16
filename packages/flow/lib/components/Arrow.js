import { __extends, __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import '../node_modules/lodash/lodash.js';
import { Group, Path, Line, Polyline } from '@antv/react-g';
import React, { Component } from 'react';
import { l as lodash } from '../_virtual/lodash.js';
import { create, fromValues } from '../node_modules/gl-matrix/esm/vec3.js';

var typeMap = {
    Path: Path,
    Line: Line,
    Polyline: Polyline,
};
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
        return (React.createElement(React.Fragment, null,
            React.createElement(typeMap[this.props.type], __assign(__assign({}, others), { ref: this.bodyRef })),
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
        var bodyType = this.props.type;
        if (bodyType === "Line") {
            var _a = this.bodyRef.current.attributes, _x1 = _a.x1, _x2 = _a.x2, _y1 = _a.y1, _y2 = _a.y2;
            x1 = isStart ? _x1 : _x2;
            x2 = isStart ? _x2 : _x1;
            y1 = isStart ? _y1 : _y2;
            y2 = isStart ? _y2 : _y1;
        }
        else if (bodyType === "Polyline") {
            var points = this.bodyRef.current.attributes.points;
            var length_1 = points.length;
            x1 = isStart ? points[1][0] : points[length_1 - 2][0];
            y1 = isStart ? points[1][1] : points[length_1 - 2][1];
            x2 = isStart ? points[0][0] : points[length_1 - 1][0];
            y2 = isStart ? points[0][1] : points[length_1 - 1][1];
        }
        else if (bodyType === "Path") {
            var _b = this.getTangent(this.bodyRef.current, isStart), p1 = _b[0], p2 = _b[1];
            x1 = p1[0];
            y1 = p1[1];
            x2 = p2[0];
            y2 = p2[1];
        }
        var x = x1 - x2;
        var y = y1 - y2;
        rad = Math.atan2(y, x);
        position = fromValues(x2, y2, 0);
        head.setLocalPosition(position);
        head.style.transform = "rotate(".concat((rad * 180) / Math.PI, "deg)");
    };
    Arrow.prototype.getTangent = function (path, isStart) {
        return isStart ? path.getStartTangent() : path.getEndTangent();
    };
    Arrow.prototype.getDefaultArrowHead = function () {
        var _a = this.props; _a.startHead; _a.endHead; _a.body; var others = __rest(_a, ["startHead", "endHead", "body"]);
        var sin = Math.sin, cos = Math.cos, PI = Math.PI;
        return (React.createElement(Path, __assign({}, others, { fill: this.props.stroke, path: "M".concat(10 * cos(PI / 6), ",").concat(10 * sin(PI / 6), " L0,0 L").concat(10 * cos(PI / 6), ",-").concat(10 * sin(PI / 6), " Z") })));
    };
    return Arrow;
}(Component));

export { Arrow };
