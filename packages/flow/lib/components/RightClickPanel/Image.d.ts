import React from "react";
import Konva from "konva";
import { ImageConfig } from "konva/lib/shapes/Image";
declare class Image extends React.Component<Omit<ImageConfig, "image">> {
    state: {
        image: any;
    };
    image: HTMLImageElement;
    imageNode: Konva.Image;
    componentDidMount(): void;
    componentDidUpdate(oldProps: any): void;
    componentWillUnmount(): void;
    loadImage(): void;
    handleLoad: () => void;
    render(): JSX.Element;
}
export default Image;
