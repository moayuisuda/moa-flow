import { __decorate } from '../node_modules/tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import React from 'react';
import { FlowContext } from '../Context.js';
import { Group } from '@antv/react-g';
import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

let LinkingEdge = class LinkingEdge extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data = this.props.data;
        if (lodash.exports.isUndefined(data.source))
            return React.createElement(React.Fragment, null);
        const RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);
        return (React.createElement(Group, { pointerEvents: "none" }, React.createElement(RegistedEdge, {
            data: Object.assign({ id: "LINKING_EDGE" }, this.props.data),
        })));
    }
};
LinkingEdge.contextType = FlowContext;
LinkingEdge = __decorate([
    observer
], LinkingEdge);
var LinkingEdge$1 = LinkingEdge;

export { LinkingEdge$1 as default };
