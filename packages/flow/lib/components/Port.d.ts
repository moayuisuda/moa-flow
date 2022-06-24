import { InteractivePointerEvent } from "@antv/g";
import React from "react";
import Cell from "../cells/Cell";
import { CellDataType } from "../cells/Cell";
import FlowModel from "../Model";
export declare type PortDataType = {
    edges?: string[];
    host?: string;
} & CellDataType;
declare type PortPropsType = {
    link?: (source: any, target: any) => boolean;
    x?: number;
    y?: number;
    anchor: {
        x: number;
        y: number;
    } | (() => {
        x: number;
        y: number;
    });
};
export declare class Port extends Cell<PortDataType, {}, PortPropsType> {
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
        x: number;
        y: number;
    };
    onLinkStart(e: InteractivePointerEvent): void;
    onLinkEnd(e: InteractivePointerEvent): void;
    content(): JSX.Element;
}
export {};
