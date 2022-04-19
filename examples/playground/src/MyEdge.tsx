import { Edge, autorun, Graph } from "@ali/flow-infra";
import { NodeFlowState } from "@ali/flow-infra";
const { Group, Circle, Line } = Graph;
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

    return `source:${source.id}`;
  }

  componentDidMount(): void {
    const { source, target } = this.getAnchors();
    this.setData({
      verticies: [
        {
          x: (source.x + target.x) / 2,
          y: source.y,
        },
        {
          x: (source.x + target.x) / 2,
          y: target.y,
        },
      ],
    });
    autorun(() => {});
  }

  // route(vectors: Konva.Vector2d[]) {
  //   const sourceAnchor = vectors[0];
  //   const targetAnchor = vectors[vectors.length - 1];

  //   const MIDDLE = (sourceAnchor.x + targetAnchor.x) / 2;

  //   return [
  //     sourceAnchor,
  //     {
  //       x: MIDDLE,
  //       y: sourceAnchor.y,
  //     },
  //     {
  //       x: MIDDLE,
  //       y: targetAnchor.y,
  //     },

  //     targetAnchor,
  //   ];
  // }

  lineExtra = () => {
    return (
      <Group>
        <Line></Line>
      </Group>
    );
  };
}

export default MyEdge;
