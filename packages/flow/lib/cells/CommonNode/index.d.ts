import type { FieldType } from "../..//types/common";
import { PortDataType } from "../..//scaffold/Port";
import Node from "../Node";
import { NodeDataType } from "../Node";
declare type CommonPortDataType = PortDataType & {
    label: string;
    portType: "in" | "out" | "control-out" | "control-in";
};
declare type CommonNodeDataType = {
    ports?: CommonPortDataType[];
    fields?: FieldType[];
    x?: number;
    y?: number;
    label?: string;
} & NodeDataType;
declare class CommonNode extends Node<CommonNodeDataType, {}> {
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
