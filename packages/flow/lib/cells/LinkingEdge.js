import { __extends, __assign, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import React from 'react';
import { FlowContext } from '../Context.js';
import { Group } from 'react-konva';

var LinkingEdge = /** @class */ (function (_super) {
    __extends(LinkingEdge, _super);
    function LinkingEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkingEdge.prototype.render = function () {
        var data = this.props.data;
        var RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);
        var id = "linkingEdge";
        if (!data.source)
            return React.createElement(React.Fragment, null);
        this.context.buffer.link.edge = id;
        return (React.createElement(Group, { listening: false }, React.createElement(RegistedEdge, {
            data: __assign({ id: id }, this.props.data),
        })));
    };
    LinkingEdge.contextType = FlowContext;
    LinkingEdge = __decorate([
        observer
    ], LinkingEdge);
    return LinkingEdge;
}(React.Component));

export { LinkingEdge as default };
