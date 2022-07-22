import { __extends, __decorate } from '../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import React from 'react';
import { FlowContext } from '../Context.js';
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
        var Model = this.context.modelFactoriesMap.get(data.component);
        return (React.createElement("g", { style: {
                pointerEvents: "none",
            } }, React.createElement(RegistedEdge, {
            model: new Model(data, this.context),
            key: data.id,
        })));
    };
    LinkingEdge.contextType = FlowContext;
    LinkingEdge = __decorate([
        observer
    ], LinkingEdge);
    return LinkingEdge;
}(React.Component));

export { LinkingEdge };
