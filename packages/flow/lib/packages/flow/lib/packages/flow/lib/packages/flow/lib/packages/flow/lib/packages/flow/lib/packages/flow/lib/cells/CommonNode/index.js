import { Rect, Group, Text, Circle } from 'react-konva';
import Button from '../../common/Button.js';
import Interactor$1 from '../../scaffold/Interactor.js';
import Node from '../Node.js';
import React from 'react';

const { Port } = Interactor$1;
const WIDTH = 200;
const HEADER_HEIGHT = 40;
const SINGLE_PORT_HEIGHT = 30;
const HEADER_MARGIN = 20;
const PORT_RADIUS = 10;
const TEXT_WIDTH = 70;
const PORT_TEXT_MARGIN = 10;
const BOTTOM_PADDING = 10;
const PORTS_OFFSET = HEADER_HEIGHT + HEADER_MARGIN;
const PORT_OFFSET = PORTS_OFFSET + SINGLE_PORT_HEIGHT / 2;
const PORT_GRAPHIC_OFFSET = PORT_RADIUS + (SINGLE_PORT_HEIGHT - PORT_RADIUS * 2) / 2;
class CommonNode extends Node {
    constructor() {
        super(...arguments);
        this.getStroke = () => {
            const isSelect = this.isSelect();
            const { color } = this.context;
            if (isSelect) {
                return {
                    stroke: color.active,
                };
            }
            else
                return {};
        };
    }
    static getBounds(cellData) {
        var _a, _b, _c, _d;
        const outPorts = ((_a = cellData.ports) === null || _a === void 0 ? void 0 : _a.filter((portData) => portData.portType === "out")) || [];
        const inPorts = ((_b = cellData.ports) === null || _b === void 0 ? void 0 : _b.filter((portData) => portData.portType === "in")) || [];
        const controlOutPorts = ((_c = cellData.ports) === null || _c === void 0 ? void 0 : _c.filter((portData) => portData.portType === "control-out")) || [];
        const controlInPorts = ((_d = cellData.ports) === null || _d === void 0 ? void 0 : _d.filter((portData) => portData.portType === "control-in")) || [];
        const height = Math.max(outPorts.length + controlOutPorts.length, inPorts.length + controlInPorts.length) *
            SINGLE_PORT_HEIGHT +
            HEADER_HEIGHT +
            HEADER_MARGIN +
            BOTTOM_PADDING;
        const width = WIDTH;
        const x = cellData.x - PORT_RADIUS * 0.5;
        const y = cellData.y;
        return {
            width,
            height,
            x,
            y,
        };
    }
    content() {
        const { color } = this.context;
        const { getStroke } = this;
        const { label, ports } = this.props.data;
        const outPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "out")) || [];
        const inPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "in")) || [];
        const controlOutPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "control-out")) || [];
        const controlInPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "control-in")) || [];
        const FULL_HEIGHT = CommonNode.getBounds(this.props.data).height;
        const { data } = this.props;
        return (React.createElement(Interactor$1, Object.assign({}, this.props.data),
            React.createElement(Rect, { width: WIDTH, height: FULL_HEIGHT, fill: "white", shadowColor: "black", shadowBlur: 10, shadowOpacity: 0.1, cornerRadius: 10 }),
            React.createElement(Group, null,
                React.createElement(Rect, { cornerRadius: [10, 10, 0, 0], width: WIDTH, height: HEADER_HEIGHT, fill: color.grey }),
                React.createElement(Text, { fontSize: 14, text: label, height: HEADER_HEIGHT, x: 20, verticalAlign: "middle" }),
                React.createElement(Button, { x: WIDTH, width: 20, height: HEADER_HEIGHT, text: "\uFF0B", onClick: (e) => {
                        this.context.addCell("CommonNode", {
                            x: this.props.data.x + 300,
                            y: this.props.data.y,
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
            React.createElement(Rect, Object.assign({ width: WIDTH, height: FULL_HEIGHT }, getStroke(), { cornerRadius: 10 })),
            React.createElement(Group, { y: PORTS_OFFSET },
                inPorts.map((portData, index) => (React.createElement(Group, { x: 0, y: index * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Port, { data: portData, anchor: () => ({
                            x: data.x,
                            y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                        }) },
                        React.createElement(Circle, { stroke: color.primary, fill: "white", radius: PORT_RADIUS, y: PORT_GRAPHIC_OFFSET })),
                    React.createElement(Text, { x: PORT_RADIUS + PORT_TEXT_MARGIN, height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", text: portData.label })))),
                controlInPorts.map((portData, index) => (React.createElement(Group, { y: (inPorts.length + index) * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Port, { data: portData, anchor: () => ({
                            x: data.x,
                            y: data.y +
                                PORT_OFFSET +
                                (inPorts.length + index) * SINGLE_PORT_HEIGHT,
                        }) },
                        React.createElement(Rect, { fill: color.primary, x: -PORT_RADIUS, y: PORT_GRAPHIC_OFFSET - PORT_RADIUS, width: PORT_RADIUS * 2, height: PORT_RADIUS * 2 })),
                    React.createElement(Text, { x: PORT_RADIUS + PORT_TEXT_MARGIN, height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", text: portData.label })))),
                outPorts.map((portData, index) => (React.createElement(Group, { x: WIDTH - TEXT_WIDTH - PORT_TEXT_MARGIN - PORT_RADIUS, y: index * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Text, { text: portData.label, align: "right", height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", width: TEXT_WIDTH }),
                    React.createElement(Port, { data: portData, anchor: () => ({
                            x: data.x + WIDTH,
                            y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                        }) },
                        React.createElement(Circle, { stroke: color.primary, fill: "white", x: TEXT_WIDTH + PORT_RADIUS + PORT_TEXT_MARGIN, y: PORT_GRAPHIC_OFFSET, radius: PORT_RADIUS }))))),
                controlOutPorts.map((portData, index) => (React.createElement(Group, { x: WIDTH - TEXT_WIDTH - PORT_RADIUS - PORT_TEXT_MARGIN, y: (outPorts.length + index) * SINGLE_PORT_HEIGHT, key: portData.label },
                    React.createElement(Text, { text: portData.label, align: "right", height: SINGLE_PORT_HEIGHT, verticalAlign: "middle", width: TEXT_WIDTH }),
                    React.createElement(Port, { data: portData, anchor: () => ({
                            x: data.x + WIDTH,
                            y: data.y +
                                PORT_OFFSET +
                                (outPorts.length + index) * SINGLE_PORT_HEIGHT,
                        }) },
                        React.createElement(Rect, { fill: color.primary, x: TEXT_WIDTH + PORT_TEXT_MARGIN, y: PORT_GRAPHIC_OFFSET - PORT_RADIUS, width: PORT_RADIUS * 2, height: PORT_RADIUS * 2 }))))))));
    }
}
CommonNode.metaData = {
    fields: [{}],
    label: "",
};

export { CommonNode as default };
