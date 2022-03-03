/// <reference types="react" />
import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import Node from "../Node";
declare type MatrixNodeType = {
    ports?: PortType[];
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
