import { PortType } from "@/scaffold/Port"

export type FieldType = {
    label: string,
    ports: PortType[]
}

export type NodeFlowState = {
    isSelect: boolean
}