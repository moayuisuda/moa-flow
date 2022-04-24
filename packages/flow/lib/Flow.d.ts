import React from "react";
import FlowModel from "./Model";
import { ModelType } from "./Model";
declare type FlowProps = {
    canvasData?: any;
    onEvent?: (e: {
        type: string;
        data: any;
    }) => void;
    onLoad?: (model: FlowModel) => void;
    zoom?: boolean;
    modelRef?: any;
    width?: number;
    height?: number;
    grid: number;
    multiSelect?: boolean;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: ModelType;
    stageRef: React.RefObject<import("konva/lib/Stage").Stage>;
    nodesLayerRef: React.RefObject<import("konva/lib/Layer").Layer>;
    linesLayerRef: React.RefObject<import("konva/lib/Layer").Layer>;
    topLayerRef: React.RefObject<import("konva/lib/Layer").Layer>;
    constructor(props: FlowProps);
    componentDidMount(): void;
    render(): JSX.Element;
}
export default Flow;
