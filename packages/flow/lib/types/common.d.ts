import { PortType } from "../scaffold/Port";
export declare type FieldType = {
    label: string;
    ports: PortType[];
};
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
    scale: {
        x: number;
        y: number;
    };
    cells: any[];
};
