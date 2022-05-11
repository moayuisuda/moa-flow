import { __extends, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { Rect } from '@antv/react-g';
import React from 'react';
import { FlowContext } from '../Context.js';
import { observer } from 'mobx-react';

var SelectBoundsRect = /** @class */ (function (_super) {
    __extends(SelectBoundsRect, _super);
    function SelectBoundsRect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectBoundsRect.prototype.render = function () {
        var _a = this.context, select = _a.buffer.select, color = _a.color, hotKey = _a.hotKey;
        return (React.createElement(React.Fragment, null, !hotKey["Space"] && hotKey["LeftMouseDown"] && (React.createElement(Rect, { x: Math.min(select.start.x, select.end.x), y: Math.min(select.start.y, select.end.y), width: Math.abs(select.start.x - select.end.x), height: Math.abs(select.start.y - select.end.y), stroke: color.primary, lineWidth: 2 }))));
    };
    SelectBoundsRect.contextType = FlowContext;
    SelectBoundsRect = __decorate([
        observer
    ], SelectBoundsRect);
    return SelectBoundsRect;
}(React.Component));

export { SelectBoundsRect as default };
