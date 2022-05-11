import React from "react";
import FlowModel from "./Model";
import * as G from "@antv/g";
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
    grid?: number;
    multiSelect?: boolean;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: FlowModel;
    stageRef: React.RefObject<G.Canvas>;
    nodesLayerRef: React.RefObject<G.Group>;
    linesLayerRef: React.RefObject<G.Group>;
    topLayerRef: React.RefObject<G.Group>;
    constructor(props: FlowProps);
    componentDidMount(): void;
    render(): JSX.Element;
}
export default Flow;
