import { __assign } from './node_modules/tslib/tslib.es6.js';
export { Html } from 'react-konva-utils';
import Flow from './Flow.js';
export { default as Flow } from './Flow.js';
export { default as Cell } from './cells/Cell.js';
export { default as Node } from './cells/Node.js';
export { default as Edge } from './cells/Edge.js';
export { default as Interactor } from './scaffold/Interactor.js';
export { default as Port } from './scaffold/Port.js';
export { default as RightClickPanel } from './components/RightClickPanel/index.js';
export { default as Image } from './components/RightClickPanel/Image.js';
import ReactDOM from './node_modules/react-dom/index.js';
import React from 'react';
import * as reactKonva from 'react-konva';
export { reactKonva as Graph };
export { autorun } from 'mobx';

var mountFlow = function (container, props) {
    var modelRef = React.createRef();
    ReactDOM.render(React.createElement(Flow, __assign(__assign({}, props), { modelRef: modelRef })), container);
    return { modelRef: modelRef };
};

export { mountFlow };
