import { Edge } from "@ali/flow-infra-g";
import type { NodeDataType } from "@ali/flow-infra-g";

export default class BizEdge extends Edge {
  labelFormatter(label: string): string {
    const { source, target } = this.getLinkNodesData() as {
      source: NodeDataType;
      target: NodeDataType;
    };

    return label + source.x + target.x;
  }
}
