import React from 'react';
import { Observer } from 'mobx-react';

var ConsumerBridge = function (props) {
    return React.createElement(props.context, {
        children: function (value) { return React.createElement(Observer, null, props.children(value)); },
    });
};

export { ConsumerBridge as default };
