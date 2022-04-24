import Cell from "./Cell";
import { CellDataType } from "./Cell";
export declare type NodeDataType = {
    x: number;
    y: number;
    type: string;
    ports?: [];
} & CellDataType;
declare abstract class Node<P = {}, S = {}> extends Cell<P & NodeDataType, S> {
    static metaData: any;
}
export default Node;
