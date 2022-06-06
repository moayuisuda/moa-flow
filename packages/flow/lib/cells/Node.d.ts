import Cell, { CellDataType } from "./Cell";
export declare type NodeDataType = {
    x: number;
    y: number;
    type: string;
    ports?: [];
} & CellDataType;
declare abstract class Node<P = {}, S = {}> extends Cell<P & NodeDataType, S> {
    static metaData: any;
    getLinkNodes(): string[];
    getLinkPorts(): string[];
    getNodeEdges(): string[];
    getPosition(): {
        x: number;
        y: number;
    };
    getChildren(): any[];
}
export default Node;
