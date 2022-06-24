import { __rest, __assign } from '../node_modules/tslib/tslib.es6.js';
import React from 'react';
import { HTML } from '@antv/react-g';
import ReactDOM from '../node_modules/react-dom/index.js';
import { Observer } from 'mobx-react';
import { useModel } from '../hooks/useModel.js';
import { FlowContext } from '../Context.js';

var Portal = function (_a) {
    var children = _a.children, others = __rest(_a, ["children"]);
    var context = useModel();
    var div = React.useState(function () { return document.createElement("div"); })[0];
    React.useLayoutEffect(function () {
        ReactDOM.render(React.createElement(FlowContext.Provider, { value: context },
            React.createElement(Observer, null, function () {
                console.log("change");
                return children;
            })), div);
    });
    React.useEffect(function () {
        return function () {
            ReactDOM.unmountComponentAtNode(div);
        };
    }, []);
    return React.createElement(HTML, __assign({ innerHTML: div }, others, { width: 0, height: 0 }));
};

export { Portal };
