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
    scaleBy?: number;
    height?: number;
    grid?: number;
    multiSelect?: boolean;
    components?: Record<string, React.FC<any>>;
    models?: Record<string, typeof CellModel>;
    linkEdge?: string;
    children?: React.ReactNode;
    undoRedo?: boolean;
};
declare class Flow extends React.Component<FlowProps, {}> {
    flowModel: FlowModel;
    static defaultProps: {};
    constructor(props: FlowProps);
    componentDidMount(): void;
    initStageEvent: () => void;
    generateEvents(): any;
    render(): JSX.Element;
}
export default Flow;
