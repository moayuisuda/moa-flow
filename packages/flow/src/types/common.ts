import { PortDataType } from "../scaffold/Port"
import { NodeDataType } from '../cells/Node';
import { EdgeDataType } from '../cells/Edge';

export type FieldType = {
    label: string,
    ports: PortDataType[]
}

export type NodeFlowState = {
    isSelect: boolean
}

export type Bounds = {
    x: number,
    y: number,
    width: number,
    height: number
}

export type CanvasDataType = {
    x: number,
    y: number,
    scale: number,
    cells: any[]
}

export type AllCellDataType = NodeDataType | EdgeDataType;

export type FlowInfraEventType = {
    type: string,
    data: any
}