import { Group } from 'react-konva';
import React from 'react';
import Cell from '../cells/Cell.js';

class Port extends Cell {
    constructor(props, context) {
        super(props, context);
    }
    // 暂时废弃
    anchor() {
        const konvaNode = this.wrapperRef.current;
        if (!konvaNode)
            return { x: 0, y: 0 };
        const rect = konvaNode.getClientRect({
            // 有relative不会caculate scale
            relativeTo: this.getStage(konvaNode),
        });
        // 通过变换矩阵将坐标还原为标准坐标
        // const t = konvaNode.getAbsoluteTransform();
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
    }
    onLinkStart(e) {
        e.cancelBubble = true;
        const { context: { buffer: { link }, }, } = this;
        this.context.sendEvent({
            type: "beforeLink",
            data: {
                source: this.props.data.id,
            },
        });
        link.source = this.props.data.id;
        link.target = this.anchor();
    }
    onLinkEnd(e) {
        e.cancelBubble = true;
        const { context, context: { buffer: { link }, }, } = this;
        const sourceInstance = context.cellsMap.get(link.source);
        if (link.source === this.props.data.id) {
            context.clearLinkBuffer();
        }
        else if (this.props.link || sourceInstance.props.link) {
            let adoptSource = true;
            let adoptTarget = true;
            const sourceData = context.getCellData(link.source);
            if (sourceInstance.props.link) {
                if (sourceInstance.props.link(sourceData, this.props.data))
                    adoptSource = true;
                else
                    adoptSource = false;
            }
            if (this.props.link) {
                if (this.props.link(sourceData, this.props.data))
                    adoptTarget = true;
                else
                    adoptTarget = false;
            }
            if (adoptSource && adoptTarget)
                context.link(link.source, this.props.data.id);
            else
                context.clearLinkBuffer();
        }
        else {
            context.link(link.source, this.props.data.id);
        }
    }
    content() {
        return (React.createElement(Group, Object.assign({ onMouseDown: (e) => this.onLinkStart(e), onMouseUp: (e) => this.onLinkEnd(e) }, this.props), this.props.children));
    }
}
Port.metaData = {
    type: "port",
    source: undefined,
    target: undefined,
};

export { Port as default };
