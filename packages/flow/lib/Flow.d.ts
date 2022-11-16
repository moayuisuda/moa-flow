import React from "react";
import FlowModel from "./Model";
import { CellModel } from "./cells/Cell";
declare type FlowProps = {
    canvasData?: any;
    onEvent?: (e: {
        type: string;
        data: any;
    }) => void;
    onLoad?: (model: FlowModel) => void;
    scale?: boolean;
    flowModelRef?: any;
    width?: number;
    height?: number;
    grid?: number;
    multiSelect?: boolean;
    components?: Record<string, React.FC<any>>;
    models?: Record<string, typeof CellModel>;
    linkEdge?: string;
    children?: React.ReactNode;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: FlowModel;
    constructor(props?: FlowProps);
    generateEvents(): Record<import("typings/common").StageEventName, React.MouseEventHandler<HTMLDivElement> | undefined>;
    render(): JSX.Element;
}
export default Flow;
