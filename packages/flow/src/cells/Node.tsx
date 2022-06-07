import Cell, { CellDataType } from "./Cell";
import G from "@antv/g";

export type NodeDataType = {
  x: number;
  y: number;
  type: string;
  ports?: [];
} & CellDataType;

export type NodePropsType<D> = {
  data: NodeDataType & D;
  wrapperRef: {
    current: null | G.Group;
  };
};

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

  getPosition() {
    return this.context.getNodePosition(this.getData().id);
  }

  getChildren() {
    return this.context.canvasData.cells.filter((cellData) => {
      cellData.parent === this.getData().id;
    });
  }
}

export default Node;
