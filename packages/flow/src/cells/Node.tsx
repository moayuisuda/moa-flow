import { CellModel, CellDataType } from "./Cell";

export type NodeDataType = {
  x: number;
  y: number;
  [index: string]: any;
} & CellDataType;

// util type
export type NodeData<D> = D & NodeDataType;

export class NodeModel<D extends NodeDataType = NodeDataType> extends CellModel {
  defaultData = (): any => ({
    x: 0,
    y: 0,
    id: "",
    component: "",
    cellType: "node",
  });

  data: D;

  getLinkNodes = () => {
    return this.context.getLinkNodes(this.data.id);
  }

  getLinkPorts = () => {
    return this.context.getLinkPorts(this.data.id);
  }

  getNodeEdges = () => {
    return this.context.getNodeEdges(this.data.id);
  }

  getPosition = () => {
    return this.context.getNodePosition(this.data.id);
  }

  getChildren = () => {
    return this.context.canvasData.cells.filter((cellData) => {
      cellData.parent === this.data.id;
    });
  }
}

// @TODO
// type BizParams = {
//   name: string;
//   age: number;
// };

// class Base<T> {
//   param: T;
//   constructor() {}
// }

// class Biz extends Base<{ name: string; age: number }> {
//   constructor() {
//     super();
//   }
// }

// const map: Record<string, typeof Base> = {
//   Biz: Biz,
// };
