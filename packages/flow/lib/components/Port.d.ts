import React from "react";
import { CellDataType } from "../cells/Cell";
import { FlowContext } from "../Context";
import { FlowModel } from "../Model";
export declare type PortDataType = {
    edges?: string[];
    host?: string;
    [index: string]: any;
} & CellDataType;
declare type PortPropsType<D extends PortDataType> = {
    link?: (source: D, target: D) => boolean;
    x?: number;
    y?: number;
    anchor: {
        x: number;
        y: number;
    } | (() => {
        x: number;
        y: number;
    });
    data: D;
};
export declare type PortData<D> = D & PortDataType;
export declare class Port<D extends PortDataType> extends React.Component<PortPropsType<D>> {
    static contextType: React.Context<FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    static defaultData: PortDataType;
    wrapperRef: React.RefObject<any>;
    constructor(props: PortPropsType<D>, context: FlowModel);
    get data(): D;
    anchor(): {
        x: number;
        y: number;
    };
    onLinkStart(e: React.MouseEvent): void;
    onLinkEnd(e: React.MouseEvent): void;
    render(): JSX.Element;
}
export {};
