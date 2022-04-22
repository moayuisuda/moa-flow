import React from "react";
import Konva from "konva";
import { ImageConfig } from "konva/lib/shapes/Image";
declare class Image extends React.Component<Omit<ImageConfig, "image">> {
    state: {
        image: HTMLImageElement | undefined;
    };
    image: HTMLImageElement;
    imageNode: Konva.Image | null;
    componentDidMount(): void;
    componentDidUpdate(oldProps: Omit<ImageConfig, "image">): void;
    componentWillUnmount(): void;
    loadImage(): void;
    handleLoad: () => void;
    render(): JSX.Element;
}
export default Image;
