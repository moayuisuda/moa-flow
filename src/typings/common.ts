import { NodeDataType } from "../cells/Node";
import { EdgeDataType } from "../cells/Edge";
import { PortDataType } from "../components/Port";

export type NodeFlowState = {
  isSelect: boolean;
};

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CanvasDataType = {
  x: number;
  y: number;
  scale: number;
  cells: any[];
};

export type AllCellDataType = NodeDataType | EdgeDataType | PortDataType;

export type FlowInfraEventType = {
  type: string;
  data: any;
};

export type Vector2d = {
  x: number;
  y: number;
};

export type Dir = [number, number];

export type StageEventName =
  | "onMouseDown"
  | "onMouseMove"
  | "onWheel"
  | "onClick"
  | "onMouseUp";
export type WindowEventName = "onKeyDown" | "onKeyUp";
export type EventName = StageEventName | WindowEventName | "init";
export type BehaviorName =
  | "clearState"
  | "link"
  | "select"
  | "drag"
  | "zoom"
  | "multiSelect"
  | "hotkeys"
  | "undoRedo";

export type CellType = "node" | "port" | "edge";

export type Override<T, R> = Omit<T, keyof R> & R;
export type Data<M, D> = Override<M, { data: D }>;
