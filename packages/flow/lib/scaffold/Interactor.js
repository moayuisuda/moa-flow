import { __rest, __decorate } from '../packages/flow/node_modules/_tslib@2.4.0@tslib/tslib.es6.js';
import { Group } from '@antv/react-g';
import React from 'react';
import { observer } from 'mobx-react';
import { FlowContext } from '../Context.js';
import Port from './Port.js';
import { EVT_LEFTCLICK } from '../constants.js';

let Interactor = class Interactor extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const _a = this, { context } = _a, _b = _a.props, { x, y, draggable = true, id, topOnFocus = true, selectable = true } = _b, others = __rest(_b, ["x", "y", "draggable", "id", "topOnFocus", "selectable"]);
        return (React.createElement(Group, Object.assign({ x: x, y: y, onMouseDown: (e) => {
                const { selectCells, buffer: { select, drag }, } = this.context;
                if (selectable) {
                    if (!selectCells.includes(this.props.id))
                        context.setSelectedCells([id]);
                    // drag
                    if (e.evt.button === EVT_LEFTCLICK) {
                        // @TODO 和drag的默认行为有歧义
                        if (topOnFocus)
                            this.context.moveTo(this.props.id, this.context.canvasData.cells.length - 1);
                        select.isSelecting = true;
                        drag.start.x = e.evt.x;
                        drag.start.y = e.evt.y;
                        drag.movedToTop = false;
                    }
                }
            } }, others), this.props.children));
    }
};
Interactor.contextType = FlowContext;
Interactor = __decorate([
    observer
], Interactor);
Interactor.Port = Port;
var Interactor$1 = Interactor;

export { Interactor$1 as default };
