import React from "react";
import { FlowContext } from "../Context";
import Model from "@/Model";
export declare type CellType = {
    id: string;
    cellType: string;
};
declare abstract class Cell<D, S = {}, P = {}> extends React.Component<{
    data: D & CellType;
} & P, S> {
    flowState: {
        isSelect: boolean;
    };
    static contextType: React.Context<Model>;
    context: React.ContextType<typeof FlowContext>;
    static getBounds: (cellData: any) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    abstract content(): JSX.Element;
    static metaData: any;
    wrapperRef: React.RefObject<any>;
    constructor(props: any, context: Model);
    static regist(model: any): void;
    static getMetaData(): {
        component: string;
    };
    getStage(konvaNode: any): any;
    setData(data: any): void;
    componentDidMount(): void;
    isSelect(): boolean;
    render(): JSX.Element;
}
declare const _default: typeof Cell;
export default _default;
