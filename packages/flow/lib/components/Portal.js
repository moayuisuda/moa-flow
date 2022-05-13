import { __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import { HTML } from '@antv/react-g';
import ReactDOM from '../node_modules/react-dom/index.js';

var Portal = function (_a) {
    var children = _a.children, others = __rest(_a, ["children"]);
    var div = React.useState(function () { return document.createElement("div"); })[0];
    React.useLayoutEffect(function () {
        ReactDOM.render(React.createElement(React.Fragment, null, children), div);
    });
    React.useEffect(function () {
        return function () {
            ReactDOM.unmountComponentAtNode(div);
        };
    }, []);
    return React.createElement(HTML, __assign({ innerHTML: div }, others, { width: 0, height: 0 }));
};

export { Portal };
