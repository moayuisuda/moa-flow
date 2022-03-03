/// <reference types="react" />
import type { FieldType } from "../../types/common";
import { PortType } from "../Port";
import Cell from "../Cell";
declare type TuringNodeType = {
    ports?: PortType[];
    fields?: FieldType[];
    x?: number;
    y?: number;
    label?: string;
};
declare class TuringNode extends Cell<TuringNodeType, {}> {
    static metaData: {
        type: string;
        component: string;
        x: number;
        y: number;
        data: {};
        fields: {}[];
        label: string;
    };
    content(): JSX.Element;
}
export default TuringNode;
