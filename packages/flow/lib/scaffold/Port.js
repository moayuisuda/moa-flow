import { __extends, __assign } from '../node_modules/tslib/tslib.es6.js';
import { Group } from 'react-konva';
import React from 'react';
import Cell from '../cells/Cell.js';

var Port = /** @class */ (function (_super) {
    __extends(Port, _super);
    function Port(props, context) {
        var _this = _super.call(this, props, context) || this;
        context.setCellData(props.data.id);
        return _this;
    }
    // 暂时废弃
    Port.prototype.anchor = function () {
        var konvaNode = this.wrapperRef.current;
        if (!konvaNode)
            return { x: 0, y: 0 };
        var rect = konvaNode.getClientRect({
            // 有relative不会caculate scale
            relativeTo: this.getStage(konvaNode),
        });
        // 通过变换矩阵将坐标还原为标准坐标
        // const t = konvaNode.getAbsoluteTransform();
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
    };
    Port.prototype.onLinkStart = function (e) {
        e.cancelBubble = true;
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
        e.cancelBubble = true;
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
        return (React.createElement(Group, __assign({ onMouseDown: function (e) { return _this.onLinkStart(e); }, onMouseUp: function (e) { return _this.onLinkEnd(e); } }, this.props), this.props.children));
    };
    Port.metaData = {
        type: "port",
        source: undefined,
        target: undefined,
    };
    return Port;
}(Cell));

export { Port as default };
