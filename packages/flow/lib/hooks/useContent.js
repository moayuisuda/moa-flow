import React from 'react';
import { Observer } from 'mobx-react';
import '../node_modules/lodash/lodash.js';
import { l as lodash } from '../_virtual/lodash.js';

var Content = function (props) {
    return (React.createElement(Observer, null, function () { return (React.createElement("div", { ref: function (ref) {
            //@TODO 看看為什麼會重複觸發
            props.wrapperRef.current = ref;
        } }, lodash.exports.isUndefined(props.data.visible) || props.data.visible ? (props.children) : (React.createElement(React.Fragment, null)))); }));
};

export { Content };
