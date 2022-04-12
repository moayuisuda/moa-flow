import { Edge } from "flow";
import { NodeFlowState } from "flow";
import Konva from "konva";

class MyEdge extends Edge {
  getStroke = ({ isSelect }: NodeFlowState) => {
    if (isSelect) {
      return {
        stroke: "red",
      };
    } else return {};
  };

  labelFormatter() {
    const { source, target } = this.getLinkNodesData();
    console.log("myEdge", this.props.data, source, target);

    return `source:${source.id}`;
  }

  route(vectors: Konva.Vector2d[]) {
    const sourceAnchor = vectors[0];
    const targetAnchor = vectors[vectors.length - 1];

    const MIDDLE = (sourceAnchor.x + targetAnchor.x) / 2;

    return [
      sourceAnchor,
      {
        x: MIDDLE,
        y: sourceAnchor.y,
      },
      {
        x: MIDDLE,
        y: targetAnchor.y,
      },

      targetAnchor,
    ];
  }
}

export default MyEdge;
