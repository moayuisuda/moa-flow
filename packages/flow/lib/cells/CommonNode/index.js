import { Rect, Group, Text, Circle } from '@antv/react-g';
import Interactor from '../../scaffold/Interactor.js';
import Node from '../Node.js';
import React from 'react';

const { Port } = Interactor;
const WIDTH = 200;
const HEADER_HEIGHT = 40;
const SINGLE_PORT_HEIGHT = 30;
const HEADER_MARGIN = 20;
const PORT_RADIUS = 10;
const TEXT_WIDTH = 70;
const PORT_TEXT_MARGIN = 10;
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
    static getBounds() {
        return {
            width: 200,
            height: 100,
        };
    }
    content() {
        const { color } = this.context;
        const { label, ports } = this.props.data;
        const outPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "out")) || [];
        const FULL_HEIGHT = CommonNode.getBounds().height;
        const { data } = this.props;
        return (React.createElement(Interactor, Object.assign({}, this.props.data, { topOnFocus: false }),
            React.createElement(Rect, { width: WIDTH, height: FULL_HEIGHT, fill: "white", shadowColor: "rgba(0,0,0,0.1)", shadowBlur: 10, radius: 10 }),
            outPorts.map((portData, index) => (React.createElement(Group, { x: WIDTH - TEXT_WIDTH - PORT_TEXT_MARGIN - PORT_RADIUS, y: index * SINGLE_PORT_HEIGHT, key: portData.label },
                React.createElement(Text, { text: portData.label, textAlign: "right", 
                    // height={SINGLE_PORT_HEIGHT}
                    textBaseline: "middle" }),
                React.createElement(Port, { data: portData, anchor: () => ({
                        x: data.x + WIDTH,
                        y: data.y + PORT_OFFSET + index * SINGLE_PORT_HEIGHT,
                    }) },
                    React.createElement(Circle, { stroke: color.primary, fill: "white", x: TEXT_WIDTH + PORT_RADIUS + PORT_TEXT_MARGIN, y: PORT_GRAPHIC_OFFSET, r: PORT_RADIUS })))))));
    }
}
CommonNode.metaData = {
    fields: [{}],
    label: "",
};

export { CommonNode as default };
