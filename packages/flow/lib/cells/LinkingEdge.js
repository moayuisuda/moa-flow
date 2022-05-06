import { __decorate } from '../packages/flow/node_modules/_tslib@2.4.0@tslib/tslib.es6.js';
import { observer } from 'mobx-react';
import React from 'react';
import { FlowContext } from '../Context.js';
import { Group } from '@antv/react-g';

let LinkingEdge = class LinkingEdge extends React.Component {
    render() {
        const data = this.props.data;
        const RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);
        const id = "linkingEdge";
        if (!data.source)
            return React.createElement(React.Fragment, null);
        this.context.buffer.link.edge = id;
        return (React.createElement(Group, null, React.createElement(RegistedEdge, {
            data: Object.assign({ id }, this.props.data),
        })));
    }
};
LinkingEdge.contextType = FlowContext;
LinkingEdge = __decorate([
    observer
], LinkingEdge);
var LinkingEdge$1 = LinkingEdge;

export { LinkingEdge$1 as default };
