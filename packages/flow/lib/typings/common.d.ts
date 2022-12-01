import { NodeDataType } from "../cells/Node";
import { EdgeDataType } from "../cells/Edge";
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
export declare type Dir = [number, number];
export declare type StageEventName = "onMouseDown" | "onMouseMove" | "onWheel" | "onClick" | "onMouseUp";
export declare type WindowEventName = "onKeyDown" | "onKeyUp";
export declare type EventName = StageEventName | WindowEventName | "init";
export declare type BehaviorName = "clearState" | "link" | "select" | "drag" | "scale" | "multiSelect" | "hotkeys" | "undoRedo";
export declare type CellType = "node" | "port" | "edge";
export declare type Override<T, R> = Omit<T, keyof R> & R;
export declare type Data<M, D> = Override<M, {
    data: D;
}>;
