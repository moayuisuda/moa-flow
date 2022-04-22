import { Image as Image$1 } from 'react-konva';
import React from 'react';

class Image extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            image: undefined,
        };
        this.handleLoad = () => {
            // after setState react-konva will update canvas and redraw the layer
            // because "image" property is changed
            this.setState({
                image: this.image,
            });
            // if you keep same image object during source updates
            // you will have to update layer manually:
            // this.imageNode.getLayer().batchDraw();
        };
    }
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener("load", this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener("load", this.handleLoad);
    }
    render() {
        return (React.createElement(Image$1, Object.assign({ image: this.state.image, ref: (node) => {
                this.imageNode = node;
            } }, this.props)));
    }
}

export { Image as default };
