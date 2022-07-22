import React from "react";
import { CellDataType } from "../cells/Cell";
import { FlowContext } from "../Context";
import { FlowModel } from "../Model";
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
    data: PortDataType;
};
export declare type PortData<D> = D & PortDataType;
export declare class Port extends React.Component<PortPropsType> {
    static contextType: React.Context<FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    static defaultData: PortDataType;
    wrapperRef: React.RefObject<any>;
    constructor(props: PortPropsType & {
        data: PortDataType;
    }, context: FlowModel);
    get data(): PortDataType;
    anchor(): {
        x: number;
        y: number;
    };
    onLinkStart(e: React.MouseEvent): void;
    onLinkEnd(e: React.MouseEvent): void;
    render(): JSX.Element;
}
export {};
