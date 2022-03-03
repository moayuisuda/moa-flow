import React from "react";
import Cell from "@/cells/Cell";
export declare type PortType = {
    linkable?: boolean;
    id: string;
    edges: string[];
    label?: string;
    anchor: {
        x: number;
        y: number;
    } | (() => {
        x: number;
        y: number;
    });
};
declare class Port extends Cell<PortType, {}> {
    wrapperRef: React.RefObject<any>;
    constructor(props: any, context: any);
    linkTo(): void;
    onLinkStart(e: any): void;
    onLinkMove(e: any): void;
    onLinkEnd(e: any): void;
    content(): JSX.Element;
}
export default Port;
