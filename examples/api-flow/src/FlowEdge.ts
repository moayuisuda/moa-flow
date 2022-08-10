import { EdgeModel, Vector2d } from "@ali/flow-infra-g";
import { InterfacePortDataType } from "./nodes/InterfaceNode/types";

export class FlowEdgeModel extends EdgeModel {
    bazier = true;

    // 业务上层方法，根据port类型来确定贝塞尔曲线的弯曲方向
    getInterfaceDir(port: string | Vector2d): [number, number] | undefined {
        if (typeof port === "string") {
            const { source, target } = this.getAnchors();
            const LENGTH = Math.max(Math.abs(target.x - source.x) * 0.5, 100);

            const sourceData = this.context.getCellData(
                port
            ) as InterfacePortDataType;
            if (!sourceData.portType) return;
            return [sourceData.portType === "in" ? -LENGTH : LENGTH, 0];
        }
    }

    getBazierDir() {
        const { source, target } = this.data;
        const originDir = super.getBazierDir();

        return {
            source: this.getInterfaceDir(source) || originDir.source,
            target: this.getInterfaceDir(target) || originDir.target,
        };
    }
}
