import { __extends, __assign } from '../../node_modules/tslib/tslib.es6.js';
import '../../components/Arrow.js';
import React from 'react';
import 'mobx-react';
import { Interactor } from '../../components/Interacotr.js';
import '../../components/Port.js';
import { Rect, Text, Circle } from '@antv/react-g';
import '../../node_modules/react-dom/index.js';
import '../../components/RightClickPanel/index.js';
import '../../components/SelectBoundsRect.js';
import Node from '../Node.js';

var Port = Interactor.Port;
var CommonNode = /** @class */ (function (_super) {
    __extends(CommonNode, _super);
    function CommonNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getStroke = function () {
            var isSelect = _this.isSelect();
            var color = _this.context.color;
            if (isSelect) {
                return {
                    stroke: color.active,
                    lineWidth: 3,
                };
            }
            else
                return {
                    stroke: undefined,
                    lineWidth: 0,
                };
        };
        return _this;
    }
    CommonNode.getBounds = function (cellData) {
        return {
            x: cellData.x,
            y: cellData.y,
            width: 200,
            height: 100,
        };
    };
    CommonNode.prototype.content = function () {
        var color = this.context.color;
        var data = this.props.data;
        var label = data.label, ports = data.ports;
        var _a = CommonNode.getBounds(data), width = _a.width, height = _a.height;
        var inPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "in"; })) || [];
        var outPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "out"; })) || [];
        return (React.createElement(Interactor, __assign({}, this.props.data),
            React.createElement(Rect, __assign({ width: width, height: height, fill: "white", shadowColor: "rgba(0,0,0,0.1)", shadowBlur: 10, radius: 10 }, this.getStroke())),
            React.createElement(Rect, { width: width, height: 40, fill: color.deepGrey, radius: 10 }),
            React.createElement(Text, { x: 10, y: 10, fontWeight: "bold", textBaseline: "top", text: label, fill: "white" }),
            inPorts.map(function (portData) { return (React.createElement(Port, { y: 70, data: portData, key: portData.label, anchor: {
                    x: data.x - 20,
                    y: data.y + 70,
                } },
                React.createElement(Circle, { lineWidth: 4, stroke: color.primary, fill: "white", r: 10 }))); }),
            outPorts.map(function (portData) { return (React.createElement(Port, { x: width, y: 70, data: portData, key: portData.label, anchor: {
                    x: data.x + width + 20,
                    y: data.y + 70,
                } },
                React.createElement(Circle, { lineWidth: 4, stroke: color.primary, fill: "white", r: 10 }))); })));
    };
    CommonNode.metaData = {
        label: "",
    };
    return CommonNode;
}(Node));

export { CommonNode as default };
