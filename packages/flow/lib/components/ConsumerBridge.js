import React from 'react';
import { Observer } from 'mobx-react';

var ConsumerBridge = function (props) {
    return (React.createElement(props.context.Consumer, null, function (value) { return React.createElement(Observer, null, function () { return props.children(value); }); }));
};

export { ConsumerBridge as default };
