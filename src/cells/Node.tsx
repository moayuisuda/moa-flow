import { CellModel, CellDataType } from "./Cell";
import { PortDataType } from "../components/Port";

export type NodeDataType = {
  x: number;
  y: number;
  [index: string]: any;
} & CellDataType;

// util type
export type NodeData<D> = D & NodeDataType;

export class NodeModel<
  D extends NodeDataType = NodeDataType
> extends CellModel {
  defaultData = (): any => ({
    x: 0,
    y: 0,
    cellType: "node",
  });
  declare data: D;

  /**@description if the node can drag */
  drag: boolean | (() => boolean) = true;

  getLinkNodes = () => {
    return this.context.getLinkNodes(this.data.id);
  };

  getLinkPorts = () => {
    return this.context.getLinkPorts(this.data.id);
  };

  getNodeEdges = () => {
    return this.context.getNodeEdges(this.data.id);
  };

  getChildren = () => {
    return this.context.canvasData.cells
      .filter((cellData) => cellData.parent === this.data.id)
      .map((cellData) => cellData.id) as string[];
  };
}
