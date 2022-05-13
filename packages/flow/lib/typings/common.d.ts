import { NodeDataType } from '../cells/Node';
import { EdgeDataType } from '../cells/Edge';
export declare type NodeFlowState = {
    isSelect: boolean;
};
export declare type Bounds = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type CanvasDataType = {
    x: number;
    y: number;
    scale: number;
    cells: any[];
};
export declare type AllCellDataType = NodeDataType | EdgeDataType;
export declare type FlowInfraEventType = {
    type: string;
    data: any;
};
export declare type Vector2d = {
    x: number;
    y: number;
};
