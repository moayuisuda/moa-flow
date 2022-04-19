import { __extends, __assign } from '../../node_modules/tslib/tslib.es6.js';
import { Rect, Group, Text, Circle } from 'react-konva';
import Button from '../../common/Button.js';
import Interactor from '../../scaffold/Interactor.js';
import Node from '../Node.js';

var Port = Interactor.Port;
var WIDTH = 200;
var HEADER_HEIGHT = 40;
var SINGLE_PORT_HEIGHT = 30;
var HEADER_MARGIN = 20;
var PORT_RADIUS = 10;
var TEXT_WIDTH = 70;
var PORT_TEXT_MARGIN = 10;
var BOTTOM_PADDING = 10;
var PORTS_OFFSET = HEADER_HEIGHT + HEADER_MARGIN;
var PORT_OFFSET = PORTS_OFFSET + SINGLE_PORT_HEIGHT / 2;
var PORT_GRAPHIC_OFFSET = PORT_RADIUS + (SINGLE_PORT_HEIGHT - PORT_RADIUS * 2) / 2;
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
                };
            }
            else
                return {};
        };
        return _this;
    }
    CommonNode.getBounds = function (cellData) {
        var _a, _b, _c, _d;
        var outPorts = ((_a = cellData.ports) === null || _a === void 0 ? void 0 : _a.filter(function (portData) { return portData.portType === "out"; })) || [];
        var inPorts = ((_b = cellData.ports) === null || _b === void 0 ? void 0 : _b.filter(function (portData) { return portData.portType === "in"; })) || [];
        var controlOutPorts = ((_c = cellData.ports) === null || _c === void 0 ? void 0 : _c.filter(function (portData) { return portData.portType === "control-out"; })) || [];
        var controlInPorts = ((_d = cellData.ports) === null || _d === void 0 ? void 0 : _d.filter(function (portData) { return portData.portType === "control-in"; })) || [];
        var height = Math.max(outPorts.length + controlOutPorts.length, inPorts.length + controlInPorts.length) *
            SINGLE_PORT_HEIGHT +
            HEADER_HEIGHT +
            HEADER_MARGIN +
            BOTTOM_PADDING;
        var width = WIDTH;
        var x = cellData.x - PORT_RADIUS * 0.5;
        var y = cellData.y;
        return {
            width: width,
            height: height,
            x: x,
            y: y,
        };
    };
    CommonNode.prototype.content = function () {
        var _this = this;
        var color = this.context.color;
        var getStroke = this.getStroke;
        var _a = this.props.data, label = _a.label, ports = _a.ports;
        var outPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "out"; })) || [];
        var inPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "in"; })) || [];
        var controlOutPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "control-out"; })) || [];
        var controlInPorts = (ports === null || ports === void 0 ? void 0 : ports.filter(function (portData) { return portData.portType === "control-in"; })) || [];
        var FULL_HEIGHT = CommonNode.getBounds(this.props.data).height;
        var data = this.props.data;
        return (React.createElement(Interactor, __assign({}, this.props.data, { topOnFocus: true }),
            React.createElement(Rect, { width: WIDTH, height: FULL_HEIGHT, fill: "white", shadowColor: "black", shadowBlur: 10, shadowOpacity: 0.1, cornerRadius: 10 }),
            React.createElement(Group, null,
                React.createElement(Rect, { cornerRadius: [10, 10, 0, 0], width: WIDTH, height: HEADER_HEIGHT, fill: color.grey }),
                React.createElement(Text, { fontSize: 14, text: label, height: HEADER_HEIGHT, x: 20, verticalAlign: "middle" }),
                React.createElement(Button, { x: WIDTH, width: 20, height: HEADER_HEIGHT, text: "\uFF0B", onClick: function (e) {
                        _this.context.addCell("CommonNode", {
                            x: _this.props.data.x + 300,
                            y: _this.props.data.y,
                            label: "new node",
                            ports: [
                                {
                                    label: "new",
                                    portType: "in",
                                },
                            ],
                        });
                        // this.context.sendEvent({
                        //   type: "chore",
                        //   data: `cell [${id}] has been added`,
                        // });
                    } })),
            React.createElement(Rect, __assign({ width: WIDTH, height: FULL_HEIGHT }, getStroke(), { cornerRadius: 10 })),
            React.createElement(Group, { y: PORTS_OFFSET },
                inPorts.map(function (portData, index) { return (React.createElement(Group, { x: 0, y: index * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Port, { data: portData, anchor: function () { return ({
                            x: data.x,
                            y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                        }); } },
                        React.createElement(Circle, { stroke: color.primary, fill: "white", radius: PORT_RADIUS, y: PORT_GRAPHIC_OFFSET })),
                    React.createElement(Text, { x: PORT_RADIUS + PORT_TEXT_MARGIN, height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", text: portData.label }))); }),
                controlInPorts.map(function (portData, index) { return (React.createElement(Group, { y: (inPorts.length + index) * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Port, { data: portData, anchor: function () { return ({
                            x: data.x,
                            y: data.y +
                                PORT_OFFSET +
                                (inPorts.length + index) * SINGLE_PORT_HEIGHT,
                        }); } },
                        React.createElement(Rect, { fill: color.primary, x: -PORT_RADIUS, y: PORT_GRAPHIC_OFFSET - PORT_RADIUS, width: PORT_RADIUS * 2, height: PORT_RADIUS * 2 })),
                    React.createElement(Text, { x: PORT_RADIUS + PORT_TEXT_MARGIN, height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", text: portData.label }))); }),
                outPorts.map(function (portData, index) { return (React.createElement(Group, { x: WIDTH - TEXT_WIDTH - PORT_TEXT_MARGIN - PORT_RADIUS, y: index * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Text, { text: portData.label, align: "right", height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", width: TEXT_WIDTH }),
                    React.createElement(Port, { data: portData, anchor: function () { return ({
                            x: data.x + WIDTH,
                            y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                        }); } },
                        React.createElement(Circle, { stroke: color.primary, fill: "white", x: TEXT_WIDTH + PORT_RADIUS + PORT_TEXT_MARGIN, y: PORT_GRAPHIC_OFFSET, radius: PORT_RADIUS })))); }),
                controlOutPorts.map(function (portData, index) { return (React.createElement(Group, { x: WIDTH - TEXT_WIDTH - PORT_RADIUS - PORT_TEXT_MARGIN, y: (outPorts.length + index) * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Text, { text: portData.label, align: "right", height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", width: TEXT_WIDTH }),
                    React.createElement(Port, { data: portData, anchor: function () { return ({
                            x: data.x + WIDTH,
                            y: data.y +
                                PORT_OFFSET +
                                (outPorts.length + index) * SINGLE_PORT_HEIGHT,
                        }); } },
                        React.createElement(Rect, { fill: color.primary, x: TEXT_WIDTH + PORT_TEXT_MARGIN, y: PORT_GRAPHIC_OFFSET - PORT_RADIUS, width: PORT_RADIUS * 2, height: PORT_RADIUS * 2 })))); }))));
    };
    CommonNode.metaData = {
        fields: [{}],
        label: "",
    };
    return CommonNode;
}(Node));

export { CommonNode as default };
