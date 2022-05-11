import { __extends, __assign, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import React from 'react';
import { FlowContext } from '../Context.js';
import { Group } from '@antv/react-g';
import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

var LinkingEdge = /** @class */ (function (_super) {
    __extends(LinkingEdge, _super);
    function LinkingEdge(props) {
        return _super.call(this, props) || this;
    }
    LinkingEdge.prototype.render = function () {
        var data = this.props.data;
        if (lodash.exports.isUndefined(data.source))
            return React.createElement(React.Fragment, null);
        var RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);
        return (React.createElement(Group, { pointerEvents: "none" }, React.createElement(RegistedEdge, {
            data: __assign({ id: "LINKING_EDGE" }, this.props.data),
        })));
    };
    LinkingEdge.contextType = FlowContext;
    LinkingEdge = __decorate([
        observer
    ], LinkingEdge);
    return LinkingEdge;
}(React.Component));

export { LinkingEdge as default };
