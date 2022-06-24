// import { Image as KonvaImage } from "react-konva";
import React from "react";
// import Konva from "konva";
// import { ImageConfig } from "konva/lib/shapes/Image";

// class Image extends React.Component<Omit<ImageConfig, "image">> {
//   state = {
//     image: undefined as HTMLImageElement | undefined,
//   };
//   image: HTMLImageElement;
//   imageNode: Konva.Image | null;
//   componentDidMount() {
//     this.loadImage();
//   }
//   componentDidUpdate(oldProps: Omit<ImageConfig, "image">) {
//     if (oldProps.src !== this.props.src) {
//       this.loadImage();
//     }
//   }
//   componentWillUnmount() {
//     this.image.removeEventListener("load", this.handleLoad);
//   }
//   loadImage() {
//     // save to "this" to remove "load" handler on unmount
//     this.image = new window.Image();
//     this.image.src = this.props.src;
//     this.image.addEventListener("load", this.handleLoad);
//   }
//   handleLoad = () => {
//     // after setState react-konva will update canvas and redraw the layer
//     // because "image" property is changed
//     this.setState({
//       image: this.image,
//     });
//     // if you keep same image object during source updates
//     // you will have to update layer manually:
//     // this.imageNode.getLayer().batchDraw();
//   };
//   render() {
//     return (
//       <KonvaImage
//         image={this.state.image}
//         ref={(node) => {
//           this.imageNode = node;
//         }}
//         {...this.props}
//       />
//     );
//   }
// }

// export default Image;

export class Image {}
