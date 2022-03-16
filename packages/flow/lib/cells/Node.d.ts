import Cell from "./Cell";
export declare type NodeType = {
    x: number;
    y: number;
    type: string;
};
declare abstract class Node<P, S> extends Cell<P & NodeType, S> {
    static metaData: any;
}
export default Node;
