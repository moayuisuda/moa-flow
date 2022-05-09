import Cell from './Cell.js';
import { Text, Group, Polyline } from '@antv/react-g';
import React from 'react';
import { isVector2d } from '../utils/util.js';
import { titleCase } from '../utils/string.js';
import { lineCenter } from '../utils/vector.js';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return React.createElement(Text, { text: "Something went wrong." });
        }
        return this.props.children;
    }
}
const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;
class Edge extends Cell {
    constructor(props, context) {
        super(props, context);
        this.bazier = true;
        this.arrow = false;
        this.dash = false;
        this.isMountEvents = false;
        this.formatVerticied = (verticies) => {
            return verticies;
        };
        this.getLinkPortsData = () => {
            return {
                source: isVector2d(this.props.data.source)
                    ? this.props.data.source
                    : this.context.cellsDataMap.get(this.props.data.source),
                target: isVector2d(this.props.data.target)
                    ? this.props.data.target
                    : this.context.cellsDataMap.get(this.props.data.target),
            };
        };
        this.getAnchors = () => {
            const { data } = this.props;
            let sourceAnchor;
            let targetAnchor;
            if (isVector2d(data.source))
                sourceAnchor = data.source;
            else {
                const sourceInstance = this.context.cellsMap.get(data.source);
                sourceAnchor =
                    (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
                        sourceInstance.anchor();
            }
            if (isVector2d(data.target))
                targetAnchor = data.target;
            else {
                const targetInstance = this.context.cellsMap.get(data.target);
                targetAnchor =
                    (targetInstance.props.anchor && targetInstance.props.anchor()) ||
                        targetInstance.anchor();
            }
            return {
                source: sourceAnchor,
                target: targetAnchor,
            };
        };
        this.labelRef = React.createRef();
    }
    lineStyle({ isSelect }) {
        const { color } = this.context;
        if (isSelect) {
            return {
                stroke: color.active,
            };
        }
        else
            return {};
    }
    getPoints() {
        const routeResult = this.route(this.getVectors());
        return this.vectorsToPoints(routeResult);
    }
    getVectors() {
        const anchors = this.getAnchors();
        const verticies = this.props.data.verticies || [];
        return [anchors.source, ...verticies, anchors.target];
    }
    getLinkNodesData() {
        const { data } = this.props;
        let source;
        let target;
        if (!isVector2d(data.source)) {
            const sourcePort = this.context.cellsDataMap.get(data.source);
            source = this.context.cellsDataMap.get(sourcePort.host);
        }
        if (!isVector2d(data.target)) {
            const targetPort = this.context.cellsDataMap.get(data.target);
            target = this.context.cellsDataMap.get(targetPort.host);
        }
        return {
            source,
            target,
        };
    }
    // 这个方法暴露出去，可自定义路由
    route(vectors) {
        return vectors;
    }
    vectorsToPoints(vectors) {
        const re = [];
        vectors.forEach((vector) => {
            re.push([vector.x, vector.y]);
        });
        return re;
    }
    labelContent() {
        const { color, refs: { linesLayerRef }, } = this.context;
        const text = this.labelFormatter(this.props.data.label);
        const textWidth = linesLayerRef.current
            .getContext()
            .measureText(text).width;
        return (React.createElement(Group, { x: -textWidth / 2 - LABEL_PADDING, y: -TEXT_HEIGHT / 2 },
            React.createElement(Text
            // height={TEXT_HEIGHT}
            // verticalAlign="middle"
            , Object.assign({ 
                // height={TEXT_HEIGHT}
                // verticalAlign="middle"
                text: this.labelFormatter(this.props.data.label) }, this.labelStyle()))));
    }
    labelStyle() {
        return {};
    }
    labelPosition() {
        const points = this.getVectors().map((vector) => [vector.x, vector.y]);
        const lineLenthCenter = lineCenter(points);
        return {
            x: lineLenthCenter[0],
            y: lineLenthCenter[1],
        };
    }
    labelRender() {
        const text = this.labelFormatter(this.props.data.label);
        return (React.createElement(Group, Object.assign({ ref: (label) => {
                if (this.isMountEvents || !label)
                    return;
                [
                    "mouseenter",
                    "mouseleave",
                    "mousedown",
                    "mouseup",
                    "dblclick",
                    "click",
                ].forEach((eventName) => {
                    label.on(eventName, (e) => {
                        const instanceEventFn = this[`onLabel${titleCase(eventName)}`];
                        instanceEventFn && instanceEventFn.call(this, e);
                        this.context.sendEvent({
                            type: `label:${eventName}`,
                            data: {
                                e,
                                cellData: this.props.data,
                                cell: this,
                            },
                        });
                    });
                });
                this.isMountEvents = true;
            } }, this.labelPosition()), text && this.labelContent()));
    }
    labelFormatter(label) {
        return label;
    }
    isLinking() {
        return this.context.buffer.link.edge === this.props.data.id;
    }
    edgeRender({ points, isLinking, }) {
        const { color } = this.context;
        const lineProps = Object.assign({ lineCap: "round", lineJoin: "round", lineWidth: 2.5, points: points, stroke: color.deepGrey, fill: color.deepGrey }, this.lineStyle({ isSelect: this.isSelect() }));
        console.log(points);
        return (React.createElement(Group, null,
            this.arrow ? (
            // <Arrow {...lineProps} pointerWidth={10} />
            React.createElement(React.Fragment, null)) : (React.createElement(Polyline, Object.assign({}, lineProps))),
            React.createElement(Polyline, { stroke: "transparent", points: points, lineWidth: 20, lineCap: "round", lineJoin: "round" })));
    }
    content() {
        console.log("render edge content");
        return (React.createElement(ErrorBoundary, null, this.edgeRender({
            points: this.getPoints(),
            isLinking: this.isLinking(),
        })));
    }
}
Edge.metaData = {
    cellType: "edge",
};

export { Edge as default };
