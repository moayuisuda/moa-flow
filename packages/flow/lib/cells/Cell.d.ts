import React from "react";
import { FlowContext } from "../Context";
import Model from "../Model";
export declare type CellDataType = {
    id: string;
    visible?: boolean;
    cellType: string;
    component: string;
    [key: string]: any;
};
declare abstract class Cell<D, S = {}, P = {}> extends React.Component<{
    data: D & CellDataType;
} & P, S> {
    static contextType: React.Context<Model>;
    context: React.ContextType<typeof FlowContext>;
    static getBounds: (cellData: any) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    abstract content(): JSX.Element;
    onMount(): void;
    static metaData: any;
    wrapperRef: React.RefObject<any>;
    constructor(props: any, context: Model);
    static regist(name: string, model: Model): void;
    static getMetaData(): {};
    setData(data: any): void;
    componentDidMount(): void;
    getData(): ({
        data: D & CellDataType;
    } & P)["data"];
    isSelect(): any;
    render(): JSX.Element;
}
declare const _default: typeof Cell;
export default _default;
