import { __extends, __rest, __assign, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { Group } from '@antv/react-g';
import React from 'react';
import { observer } from 'mobx-react';
import { FlowContext } from '../Context.js';
import { Port } from './Port.js';

var Interactor = /** @class */ (function (_super) {
    __extends(Interactor, _super);
    function Interactor(props) {
        return _super.call(this, props) || this;
    }
    Interactor.prototype.render = function () {
        var _this = this;
        var _a = this, context = _a.context, _b = _a.props; _b.draggable; var id = _b.id, _d = _b.topOnFocus, topOnFocus = _d === void 0 ? true : _d, _e = _b.selectable, selectable = _e === void 0 ? true : _e, others = __rest(_b, ["draggable", "id", "topOnFocus", "selectable"]);
        return (React.createElement(Group, __assign({ onRightdown: function () {
                var selectCells = _this.context.selectCells;
                if (selectable) {
                    if (!selectCells.includes(_this.props.id))
                        context.setSelectedCells([id]);
                }
            }, onMousedown: function (e) {
                e.stopPropagation();
                var _a = _this.context, selectCells = _a.selectCells, _b = _a.buffer, select = _b.select, drag = _b.drag;
                if (selectable) {
                    if (!selectCells.includes(_this.props.id))
                        context.setSelectedCells([id]);
                    // drag
                    if (topOnFocus)
                        _this.context.moveTo(_this.props.id, _this.context.canvasData.cells.length - 1);
                    select.isSelecting = true;
                    drag.start.x = e.canvas.x;
                    drag.start.y = e.canvas.y;
                }
            } }, others, { x: 0, y: 0 }), this.props.children));
    };
    Interactor.contextType = FlowContext;
    Interactor = __decorate([
        observer
    ], Interactor);
    return Interactor;
}(React.Component));
Interactor.Port = Port;

export { Interactor };
