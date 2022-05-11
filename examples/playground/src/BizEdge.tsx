import { Edge } from "@ali/flow-infra-g";
import type { NodeDataType } from "@ali/flow-infra-g";

export default class BizEdge extends Edge {
  protected bazier: boolean = true;

  onMount() {
    this.setData({
      label: "自定义",
    });
  }

  labelFormatter(label: string): string {
    const { source, target } = this.getLinkNodesData() as {
      source: NodeDataType;
      target: NodeDataType;
    };

    if (!source || !target) return "正在创建连线";

    return label + String(source.x + target.x);
  }
}
