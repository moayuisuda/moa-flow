import Cell from "./Cell";
import { CellType } from "./Cell";

export type NodeType = {
  x: number;
  y: number;
  type: string;
  ports?: [];
} & CellType;

abstract class Node<P = {}, S = {}> extends Cell<P & NodeType, S> {
  static metaData: any = {
    x: 0,
    y: 0,
    cellType: "node",
  };
}

export default Node;
