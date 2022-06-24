import React from 'react';
import { Canvas } from '../Flow.js';

var getCanvas = function (children) {
    var childrenArray = React.Children.toArray(children);
    return childrenArray.find(function (item) {
        var _a;
        var innerChildren = React.Children.toArray(item.props.children);
        if (((_a = innerChildren[0]) === null || _a === void 0 ? void 0 : _a.type) === Canvas || item.type === Canvas)
            return item;
    });
};

export { getCanvas };
