import { Group } from '@antv/react-g';
import React from 'react';
import Cell from '../cells/Cell.js';
import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

class Port extends Cell {
    constructor(props, context) {
        super(props, context);
    }
    anchor() {
        return lodash.exports.isFunction(this.props.anchor)
            ? this.props.anchor()
            : this.props.anchor;
    }
    onLinkStart(e) {
        e.stopPropagation();
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
        e.stopPropagation();
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
        return (React.createElement(Group, { onMousedown: (e) => this.onLinkStart(e), onMouseup: (e) => this.onLinkEnd(e), x: this.props.x || 0, y: this.props.y || 0 }, this.props.children));
    }
}
Port.metaData = {
    cellType: "port",
    source: undefined,
    target: undefined,
};

export { Port as default };
