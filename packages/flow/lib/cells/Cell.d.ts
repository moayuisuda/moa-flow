import React from "react";
export declare type CellType = {
    id: string;
};
declare abstract class Cell<P, S> extends React.Component<P & CellType, S> {
    static contextType: React.Context<import("../Context").FlowContextType>;
    abstract content(): JSX.Element;
    static metaData: any;
    constructor(props: any, context: any);
    static registComponent(model: any): void;
    static getMetaData(): {};
    setCellData(data: any): void;
    isSelected(): any;
    render(): JSX.Element;
}
declare const _default: typeof Cell;
export default _default;
