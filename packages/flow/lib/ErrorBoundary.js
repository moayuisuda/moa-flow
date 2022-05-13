import { __extends } from './node_modules/tslib/tslib.es6.js';
import { Text } from '@antv/react-g';
import React from 'react';

var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return React.createElement(Text, { text: "Something went wrong." });
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));

export { ErrorBoundary as default };
