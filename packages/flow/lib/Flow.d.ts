import React from "react";
import FlowModel from "./Model";
declare type FlowProps = {
    canvasData?: any;
    onEvent?: (e: {
        type: string;
        data: any;
    }) => void;
    onLoad?: (model: FlowModel) => void;
    modelRef?: any;
    width?: number;
    height?: number;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: FlowModel;
    constructor(props: FlowProps);
    render(): JSX.Element;
}
export default Flow;
