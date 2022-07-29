import React from "react";
import FlowModel from "./Model";
declare type FlowProps = {
    canvasData?: any;
    onEvent?: (e: {
        type: string;
        data: any;
    }) => void;
    onLoad?: (model: FlowModel) => void;
    scale?: boolean;
    modelRef?: any;
    width?: number;
    height?: number;
    grid?: number;
    multiSelect?: boolean;
    components?: Record<string, React.FC<any>>;
    linkEdge?: string;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: FlowModel;
    constructor(props?: FlowProps);
    getEvents(): Record<import("typings/common").StageEventName, React.MouseEventHandler<HTMLDivElement> | undefined>;
    render(): JSX.Element;
}
export default Flow;
