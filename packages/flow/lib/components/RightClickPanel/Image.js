import { __extends, __assign } from '../../node_modules/tslib/tslib.es6.js';
import { Image as Image$1 } from 'react-konva';
import React from 'react';

var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            image: null,
        };
        _this.handleLoad = function () {
            // after setState react-konva will update canvas and redraw the layer
            // because "image" property is changed
            _this.setState({
                image: _this.image,
            });
            // if you keep same image object during source updates
            // you will have to update layer manually:
            // this.imageNode.getLayer().batchDraw();
        };
        return _this;
    }
    Image.prototype.componentDidMount = function () {
        this.loadImage();
    };
    Image.prototype.componentDidUpdate = function (oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    };
    Image.prototype.componentWillUnmount = function () {
        this.image.removeEventListener("load", this.handleLoad);
    };
    Image.prototype.loadImage = function () {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener("load", this.handleLoad);
    };
    Image.prototype.render = function () {
        var _this = this;
        return (React.createElement(Image$1, __assign({ image: this.state.image, ref: function (node) {
                _this.imageNode = node;
            } }, this.props)));
    };
    return Image;
}(React.Component));

export { Image as default };
