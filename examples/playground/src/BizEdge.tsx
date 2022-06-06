import { Edge, Vector2d } from "@ali/flow-infra-g";
import type { NodeDataType } from "@ali/flow-infra-g";
import { BizPortDataType } from "./BizNode";

export default class BizEdge extends Edge {
  componentDidMount() {
    super.componentDidMount();
    this.setData({
      label: "自定义",
    });
  }

  bazier = true;
  lineDash = [10, 10] as [number, number];
  animate = () => {
    return true;
  };

  labelFormatter(label: string): string {
    const { source, target } = this.getLinkNodesData() as {
      source: NodeDataType;
      target: NodeDataType;
    };

    if (!source || !target) return "正在创建连线";

    return label + String(source.x + target.x);
  }

  // 业务上层方法，根据port类型来确定贝塞尔曲线的弯曲方向
  getBizDir(port: string | Vector2d): [number, number] | undefined {
    if (typeof port === "string") {
      const { source, target } = this.getAnchors();
      const LENGTH = Math.max(Math.abs(target.x - source.x) * 0.5, 100);

      const sourceData = this.context.getCellData(port) as BizPortDataType;
      if (!sourceData.portType) return;
      return [sourceData.portType === "in" ? -LENGTH : LENGTH, 0];
    }
  }

  getBazierDir() {
    const { source, target } = this.getData();
    const originDir = super.getBazierDir();

    return {
      source: this.getBizDir(source) || originDir.source,
      target: this.getBizDir(target) || originDir.target,
    };
  }
}
