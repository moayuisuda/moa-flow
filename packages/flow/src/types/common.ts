import { PortType } from "../scaffold/Port"

export type FieldType = {
    label: string,
    ports: PortType[]
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
    scale: { x: number, y: number },
    cells: any[]
}