import { __extends, __decorate } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import '../node_modules/lodash/lodash.js';
import { FlowContext } from '../Context.js';
import { observer } from 'mobx-react';
import { l as lodash } from '../_virtual/lodash.js';

var Port = /** @class */ (function (_super) {
    __extends(Port, _super);
    function Port(props, context) {
        var _this = _super.call(this, props, context) || this;
        context.cellsMap.set(props.data.id, _this);
        _this.wrapperRef = context.getWrapperRef(props.data.id);
        return _this;
    }
    Object.defineProperty(Port.prototype, "data", {
        get: function () {
            return this.props.data;
        },
        enumerable: false,
        configurable: true
    });
    Port.prototype.anchor = function () {
        return lodash.exports.isFunction(this.props.anchor)
            ? this.props.anchor()
            : this.props.anchor;
    };
    Port.prototype.onLinkStart = function (e) {
        e.stopPropagation();
        var link = this.context.buffer.link;
        this.context.emitEvent({
            type: "beforeLink",
            data: {
                source: this.props.data.id,
            },
        });
        link.source = this.props.data.id;
        link.target = this.anchor();
    };
    Port.prototype.onLinkEnd = function (e) {
        e.stopPropagation();
        var _a = this, context = _a.context, link = _a.context.buffer.link;
        var sourceInstance = context.cellsMap.get(link.source);
        if (link.source === this.props.data.id) {
            context.clearLinkBuffer();
        }
        else if (this.props.link || sourceInstance.props.link) {
            var adoptSource = true;
            var adoptTarget = true;
            var sourceData = context.getCellData(link.source);
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
    };
    Port.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { ref: this.wrapperRef, style: {
                cursor: "crosshair",
            }, onMouseDown: function (e) { return _this.onLinkStart(e); }, onMouseUp: function (e) { return _this.onLinkEnd(e); } }, this.props.children));
    };
    Port.contextType = FlowContext;
    Port.defaultData = {
        id: "",
        component: "Port",
        cellType: "port",
        source: undefined,
        target: undefined,
    };
    Port = __decorate([
        observer
    ], Port);
    return Port;
}(React.Component));

export { Port };
