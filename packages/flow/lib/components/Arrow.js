import { __extends, __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import '../node_modules/lodash/lodash.js';
import React, { Component } from 'react';
import { l as lodash } from '../_virtual/lodash.js';
import v4 from '../packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

var DEFAULT_ARROW_SIZE = 16;
var Arrow = /** @class */ (function (_super) {
    __extends(Arrow, _super);
    function Arrow(props) {
        var _this = _super.call(this, props) || this;
        _this.id = v4();
        return _this;
    }
    Arrow.prototype.getArrowHead = function (head, isStart) {
        var headInstance;
        if (lodash.exports.isBoolean(head)) {
            headInstance = this.getDefaultArrowHead();
        }
        else {
            headInstance = isStart ? this.props.startHead : this.props.endHead;
        }
        return (React.createElement("defs", null,
            React.createElement("marker", { id: this.getHeadId(isStart), viewBox: "-10 -10 20 20", markerWidth: "6", markerHeight: "6", orient: "auto" }, headInstance)));
    };
    Arrow.prototype.getHeadId = function (isStart) {
        return this.id + isStart ? "START" : "END";
    };
    Arrow.prototype.render = function () {
        var _a = this.props, startHead = _a.startHead, endHead = _a.endHead, others = __rest(_a, ["startHead", "endHead"]);
        return (React.createElement("g", null,
            startHead && this.getArrowHead(startHead, true),
            endHead && this.getArrowHead(endHead, false),
            React.createElement("path", __assign({ markerStart: "url(#".concat(this.getHeadId(true), ")"), markerEnd: "url(#".concat(this.getHeadId(false), ")") }, others))));
    };
    Arrow.prototype.getDefaultArrowHead = function () {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var _a = this.props; _a.startHead; _a.endHead; var others = __rest(_a, ["startHead", "endHead"]);
        var sin = Math.sin, cos = Math.cos, PI = Math.PI;
        return (React.createElement("path", __assign({}, others, { lineDash: undefined, fill: this.props.stroke, path: "M-".concat(DEFAULT_ARROW_SIZE * cos(PI / 6), ",").concat(DEFAULT_ARROW_SIZE * sin(PI / 6), " L0,0 L-").concat(DEFAULT_ARROW_SIZE * cos(PI / 6), ",-").concat(DEFAULT_ARROW_SIZE * sin(PI / 6), " Z") })));
    };
    return Arrow;
}(Component));

export { Arrow };
