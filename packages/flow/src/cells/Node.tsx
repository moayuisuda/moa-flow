import Cell from "./Cell";
import { CellDataType } from "./Cell";
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
}

export default Node;
