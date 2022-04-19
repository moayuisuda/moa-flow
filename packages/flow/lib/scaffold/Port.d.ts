import React from "react";
import Cell from "../cells/Cell";
import { CellType } from "../cells/Cell";
import { KonvaEventObject } from "konva/lib/Node";
export declare type PortType = {
    id: string;
    anchor: {
        x: number;
        y: number;
    } | (() => {
        x: number;
        y: number;
    });
    edges?: string[];
    host: string;
} & CellType;
declare class Port extends Cell<PortType, {}, {
    link: (source: PortType & unknown, target: PortType & unknown) => boolean;
}> {
    wrapperRef: React.RefObject<any>;
    static metaData: {
        type: string;
        source: undefined;
        target: undefined;
    };
    constructor(props: any, context: any);
    anchor(): {
        x: any;
        y: any;
    };
    onLinkStart(e: KonvaEventObject<MouseEvent>): void;
    onLinkEnd(e: KonvaEventObject<MouseEvent>): void;
    content(): JSX.Element;
}
export default Port;
