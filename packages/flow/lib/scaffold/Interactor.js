import { __extends, __rest, __assign, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { Group } from 'react-konva';
import React from 'react';
import { observer } from 'mobx-react';
import { FlowContext } from '../Context.js';
import Port from './Port.js';
import { EVT_LEFTCLICK } from '../constants.js';

var Interactor = /** @class */ (function (_super) {
    __extends(Interactor, _super);
    function Interactor(props) {
        return _super.call(this, props) || this;
    }
    Interactor.prototype.render = function () {
        var _this = this;
        var _a = this, context = _a.context, _b = _a.props, x = _b.x, y = _b.y; _b.draggable; var id = _b.id; _b.topOnFocus; var _d = _b.selectable, selectable = _d === void 0 ? true : _d, others = __rest(_b, ["x", "y", "draggable", "id", "topOnFocus", "selectable"]);
        return (React.createElement(Group, __assign({ x: x, y: y, onMouseDown: function (e) {
                var _a = _this.context, selectCells = _a.selectCells, _b = _a.buffer, select = _b.select, drag = _b.drag;
                if (selectable) {
                    if (!selectCells.includes(_this.props.id))
                        context.setSelectedCells([id]);
                    // drag
                    if (e.evt.button === EVT_LEFTCLICK) {
                        select.isSelecting = true;
                        drag.start.x = e.evt.x;
                        drag.start.y = e.evt.y;
                        drag.movedToTop = false;
                    }
                }
            } }, others), this.props.children));
    };
    Interactor.contextType = FlowContext;
    Interactor = __decorate([
        observer
    ], Interactor);
    return Interactor;
}(React.Component));
Interactor.Port = Port;

export { Interactor as default };
