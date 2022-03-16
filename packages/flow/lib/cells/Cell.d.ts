import React from "react";
export declare type CellType = {
    id: string;
    type: string;
};
declare abstract class Cell<D, S = {}, P = {}> extends React.Component<{
    data: D & CellType;
} & P, S> {
    static contextType: React.Context<import("../Context").FlowContextType>;
    abstract content(): JSX.Element;
    static metaData: any;
    wrapperRef: React.RefObject<any>;
    constructor(props: any, context: any);
    static regist(model: any): void;
    static getMetaData(): any;
    isSelected(): any;
    getStage(konvaNode: any): any;
    setCellData(data: any): void;
    render(): JSX.Element;
}
declare const _default: typeof Cell;
export default _default;
