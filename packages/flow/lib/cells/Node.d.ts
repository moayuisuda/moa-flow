import Cell from "./Cell";
export declare type CellType = {
    id: string;
};
declare abstract class Node<P, S> extends Cell<P, S> {
    static metaData: any;
}
export default Node;
