import type { FieldType } from "../../types/common";
import { PortDataType } from "../../scaffold/Port";
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
        label: string;
    };
    static getBounds(cellData: NodeDataType): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    getStroke: () => {
        stroke: string;
        lineWidth: number;
    } | {
        stroke: undefined;
        lineWidth: number;
    };
    content(): JSX.Element;
}
export default CommonNode;
