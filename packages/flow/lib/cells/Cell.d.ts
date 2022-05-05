import React from "react";
import { FlowContext } from "../Context";
import Model from "../Model";
import { AllCellDataType } from "../types/common";
export declare type CellDataType = {
    id: string;
    cellType: string;
    component: string;
    [key: string]: any;
};
declare abstract class Cell<D, S = {}, P = {}> extends React.Component<{
    data: D & CellDataType;
} & P, S> {
    static contextType: React.Context<Model>;
    context: React.ContextType<typeof FlowContext>;
    static getBounds: (cellData: AllCellDataType) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    abstract content(): JSX.Element;
    static metaData: any;
    wrapperRef: React.RefObject<any>;
    constructor(props: any, context: Model);
    static regist(name: string, model: Model): void;
    static getMetaData(): {};
    getStage(): import("konva/lib/Stage").Stage | null | undefined;
    setData(data: any): void;
    onMount: () => void;
    componentDidMount(): void;
    getData(): ({
        data: D & CellDataType;
    } & P)["data"];
    isSelect(): any;
    render(): JSX.Element;
}
declare const _default: typeof Cell;
export default _default;
