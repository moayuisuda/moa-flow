import { Edge } from "flow";
import { NodeFlowState } from "flow";

class MyEdge extends Edge {
  getStroke = ({ isSelect }: NodeFlowState) => {
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: "red",
      };
    } else return {};
  };

  labelFormatter() {
    const { source, target } = this.getLinkNodesData();

    return source.x + target.y;
  }
}

export default MyEdge;
