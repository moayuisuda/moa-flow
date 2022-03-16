import Cell from "./Cell";

export type NodeType = { x: number; y: number; type: string };

abstract class Node<P, S> extends Cell<P & NodeType, S> {
  static metaData: any = {
    x: 0,
    y: 0,
    type: "node",
  };
}

export default Node;
