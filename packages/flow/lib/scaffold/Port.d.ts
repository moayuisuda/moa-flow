import React from "react";
import Cell from "@/cells/Cell";
export declare type PortType = {
    linkable?: boolean;
    id: string;
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
    static metaData: {
        source: any;
        target: any;
    };
    constructor(props: any, context: any);
    componentDidMount(): void;
    anchor(): {
        x: any;
        y: any;
    };
    onLinkStart(e: any): void;
    onLinkEnd(e: any): void;
    content(): JSX.Element;
}
export default Port;
