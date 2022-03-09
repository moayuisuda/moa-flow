/// <reference types="react" />
import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import Node from "../Node";
declare type MatrixPortType = PortType & {
    label: string;
};
declare type MatrixNodeType = {
    ports?: MatrixPortType[];
    fields?: FieldType[];
    x?: number;
    y?: number;
    label?: string;
};
declare class MatrixNode extends Node<MatrixNodeType, {}> {
    static metaData: {
        fields: {}[];
        label: string;
    };
    getStroke: () => {
        stroke: any;
    } | {
        stroke?: undefined;
    };
    content(): JSX.Element;
}
export default MatrixNode;
