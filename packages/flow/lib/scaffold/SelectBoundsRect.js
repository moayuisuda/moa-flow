import { __decorate } from '../packages/flow/node_modules/_tslib@2.4.0@tslib/tslib.es6.js';
import { Rect } from '@antv/react-g';
import React from 'react';
import { FlowContext } from '../Context.js';
import { observer } from 'mobx-react';

let SelectBoundsRect = class SelectBoundsRect extends React.Component {
    render() {
        const { buffer: { select }, color, hotKey, } = this.context;
        return (React.createElement(React.Fragment, null, !hotKey["Space"] && hotKey["LeftMouseDown"] && (React.createElement(Rect, { x: Math.min(select.start.x, select.end.x), y: Math.min(select.start.y, select.end.y), width: Math.abs(select.start.x - select.end.x), height: Math.abs(select.start.y - select.end.y), stroke: color.primary }))));
    }
};
SelectBoundsRect.contextType = FlowContext;
SelectBoundsRect = __decorate([
    observer
], SelectBoundsRect);
var SelectBoundsRect$1 = SelectBoundsRect;

export { SelectBoundsRect$1 as default };
