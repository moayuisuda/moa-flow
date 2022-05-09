import { Rect, Text, Circle } from '@antv/react-g';
import Interactor from '../../scaffold/Interactor.js';
import Node from '../Node.js';
import React from 'react';

const { Port } = Interactor;
class CommonNode extends Node {
    constructor() {
        super(...arguments);
        this.getStroke = () => {
            const isSelect = this.isSelect();
            const { color } = this.context;
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
    }
    static getBounds(cellData) {
        return {
            x: cellData.x,
            y: cellData.y,
            width: 200,
            height: 100,
        };
    }
    content() {
        const { color } = this.context;
        const { data } = this.props;
        const { label, ports } = data;
        const { width, height } = CommonNode.getBounds(data);
        const inPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "in")) || [];
        const outPorts = (ports === null || ports === void 0 ? void 0 : ports.filter((portData) => portData.portType === "out")) || [];
        return (React.createElement(Interactor, Object.assign({}, this.props.data),
            React.createElement(Rect, Object.assign({ width: width, height: height, fill: "white", shadowColor: "rgba(0,0,0,0.1)", shadowBlur: 10, radius: 10 }, this.getStroke())),
            React.createElement(Rect, { width: width, height: 40, fill: color.deepGrey, radius: 10 }),
            React.createElement(Text, { x: 10, y: 10, fontWeight: "bold", textBaseline: "top", text: label, fill: "white" }),
            inPorts.map((portData, index) => (React.createElement(Port, { y: 70, data: portData, key: portData.label },
                React.createElement(Circle, { lineWidth: 4, stroke: color.primary, fill: "white", r: 10 })))),
            outPorts.map((portData, index) => (React.createElement(Port, { x: width, y: 70, data: portData, key: portData.label },
                React.createElement(Circle, { lineWidth: 4, stroke: color.primary, fill: "white", r: 10 }))))));
    }
}
CommonNode.metaData = {
    label: "",
};

export { CommonNode as default };
