/// <reference types="react" />
import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import Node from "../Node";
import { NodeType } from "../Node";
declare type MatrixPortType = PortType & {
    label: string;
    portType: "in" | "out" | "control-out" | "control-in";
};
declare type MatrixNodeType = {
    ports?: MatrixPortType[];
    fields?: FieldType[];
    x?: number;
    y?: number;
    label?: string;
} & NodeType;
declare class MatrixNode extends Node<MatrixNodeType, {}> {
    static metaData: {
        fields: {}[];
        label: string;
    };
    static getBounds(cellData: any): {
        width: number;
        height: number;
        x: number;
        y: any;
    };
    getStroke: () => {
        stroke: string;
    } | {
        stroke?: undefined;
    };
    content(): JSX.Element;
}
export default MatrixNode;
