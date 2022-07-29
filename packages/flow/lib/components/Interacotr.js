import { __extends } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import { FlowContext } from '../Context.js';
import { Port } from './Port.js';

var Interactor = /** @class */ (function (_super) {
    __extends(Interactor, _super);
    function Interactor(props) {
        return _super.call(this, props) || this;
    }
    Interactor.prototype.render = function () {
        var _this = this;
        var _a = this, context = _a.context, _b = _a.props, id = _b.id, _c = _b.topOnFocus, topOnFocus = _c === void 0 ? false : _c, _d = _b.inSvg, inSvg = _d === void 0 ? false : _d;
        var onMouseDown = function (e) {
            e.stopPropagation();
            var _a = _this.context, selectCells = _a.selectCells, _b = _a.buffer, select = _b.select, drag = _b.drag;
            if (!selectCells.includes(_this.props.id)) {
                context.setSelectedCells([id]);
            }
            // drag
            if (topOnFocus)
                _this.context.moveTo(_this.props.id, _this.context.canvasData.cells.length - 1);
            select.isSelecting = true;
            var coord = _this.context.getCursorCoord(e);
            drag.start.x = coord.x;
            drag.start.y = coord.y;
        };
        return inSvg ? (React.createElement("g", { style: {
                pointerEvents: "auto",
            }, onMouseDown: onMouseDown }, this.props.children)) : (React.createElement("div", { style: {
                pointerEvents: "auto",
            }, onMouseDown: onMouseDown }, this.props.children));
    };
    Interactor.contextType = FlowContext;
    return Interactor;
}(React.Component));
Interactor.Port = Port;

export { Interactor };
