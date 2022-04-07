import React from "react";
import Cell from "@/cells/Cell";
import { CellType } from "../cells/Cell";
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
        source: any;
        target: any;
    };
    constructor(props: any, context: any);
    anchor(): {
        x: any;
        y: any;
    };
    onLinkStart(e: any): void;
    onLinkEnd(e: any): void;
    content(): JSX.Element;
}
export default Port;
