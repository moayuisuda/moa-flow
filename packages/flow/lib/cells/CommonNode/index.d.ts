/// <reference types="react" />
import type { FieldType } from "@/types/common";
import { PortType } from "@/scaffold/Port";
import Node from "../Node";
import { NodeType } from "../Node";
declare type CommonPortType = PortType & {
    label: string;
    portType: "in" | "out" | "control-out" | "control-in";
};
declare type CommonNodeType = {
    ports?: CommonPortType[];
    fields?: FieldType[];
    x?: number;
    y?: number;
    label?: string;
} & NodeType;
declare class CommonNode extends Node<CommonNodeType, {}> {
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
export default CommonNode;
