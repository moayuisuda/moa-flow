import Cell from "./Cell";

export type CellType = { id: string };

abstract class Node<P, S> extends Cell<P, S> {
  static metaData: any = {
    x: 0,
    y: 0,
    type: "node",
  };
}

export default Node;
