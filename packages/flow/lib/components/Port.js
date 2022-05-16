import { __extends } from '../node_modules/tslib/tslib.es6.js';
import { Group } from '@antv/react-g';
import React from 'react';
import Cell from '../cells/Cell.js';
import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

var Port = /** @class */ (function (_super) {
    __extends(Port, _super);
    function Port(props, context) {
        return _super.call(this, props, context) || this;
    }
    Port.prototype.anchor = function () {
        return lodash.exports.isFunction(this.props.anchor)
            ? this.props.anchor()
            : this.props.anchor;
    };
    Port.prototype.onLinkStart = function (e) {
        e.stopPropagation();
        var link = this.context.buffer.link;
        this.context.sendEvent({
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
    Port.prototype.content = function () {
        var _this = this;
        return (React.createElement(Group, { cursor: "crosshair", onMousedown: function (e) { return _this.onLinkStart(e); }, onMouseup: function (e) { return _this.onLinkEnd(e); }, x: this.props.x || 0, y: this.props.y || 0 }, this.props.children));
    };
    Port.metaData = {
        cellType: "port",
        source: undefined,
        target: undefined,
    };
    return Port;
}(Cell));

export { Port };
