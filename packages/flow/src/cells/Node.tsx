import Cell, { CellDataType } from "./Cell";
export type NodeDataType = {
  x: number;
  y: number;
  type: string;
  ports?: [];
} & CellDataType;

abstract class Node<P = {}, S = {}> extends Cell<P & NodeDataType, S> {
  static metaData: any = {
    x: 0,
    y: 0,
    cellType: "node",
  };

  getLinkNodes() {
    return this.context.getLinkNodes(this.props.data.id);
  }

  getLinkPorts() {
    return this.context.getLinkPorts(this.props.data.id);
  }

  getNodeEdges() {
    return this.context.getNodeEdges(this.props.data.id);
  }
}

export default Node;
