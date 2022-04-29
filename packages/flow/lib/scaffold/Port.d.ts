import React from "react";
import Cell from "../cells/Cell";
import { CellDataType } from "../cells/Cell";
import { KonvaEventObject } from "konva/lib/Node";
import FlowModel from "../Model";
export declare type PortDataType = {
    edges?: string[];
    host?: string;
} & CellDataType;
declare type PortPropsType = {
    link?: (source: any, target: any) => boolean;
    x?: number;
    y?: number;
    anchor?: {
        x: number;
        y: number;
    } | (() => {
        x: number;
        y: number;
    });
};
declare class Port extends Cell<PortDataType, {}, PortPropsType> {
    wrapperRef: React.RefObject<any>;
    static metaData: {
        cellType: string;
        source: undefined;
        target: undefined;
    };
    constructor(props: PortPropsType & {
        data: PortDataType;
    }, context: FlowModel);
    anchor(): {
        x: any;
        y: any;
    };
    onLinkStart(e: KonvaEventObject<MouseEvent>): void;
    onLinkEnd(e: KonvaEventObject<MouseEvent>): void;
    content(): JSX.Element;
}
export default Port;
