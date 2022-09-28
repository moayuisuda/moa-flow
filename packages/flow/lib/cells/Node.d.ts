import { CellModel, CellDataType } from "./Cell";
export declare type NodeDataType = {
    x: number;
    y: number;
    [index: string]: any;
} & CellDataType;
export declare type NodeData<D> = D & NodeDataType;
export declare class NodeModel<D extends NodeDataType = NodeDataType> extends CellModel {
    defaultData: () => any;
    data: D;
    getLinkNodes: () => string[];
    getLinkPorts: () => string[];
    getNodeEdges: () => string[];
    getPosition: () => {
        x: number;
        y: number;
    };
    getChildren: () => any[];
}
