import Cell, { CellDataType } from "./Cell";
import G from "@antv/g";
export declare type NodeDataType = {
    x: number;
    y: number;
    type: string;
    ports?: [];
} & CellDataType;
export declare type NodePropsType<D> = {
    data: NodeDataType & D;
    wrapperRef: {
        current: null | G.Group;
    };
};
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
