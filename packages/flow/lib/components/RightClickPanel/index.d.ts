import * as G from "@antv/g";
import React from "react";
import Model from "../../Model";
declare class RightClickPanel extends React.Component<{
    stage?: G.Canvas;
    extra?: (context: Model) => React.ReactNode;
}, {
    pos: {
        x: number;
        y: number;
    };
}> {
    static contextType: React.Context<Model>;
    initStageEvent: () => void;
    componentDidMount(): void;
    constructor(props: any);
    dele(): void;
    moveToTop(): void;
    render(): JSX.Element;
}
export declare const getRightClickPanel: (children: React.ReactNode[] | React.ReactNode) => React.ReactChild | React.ReactFragment | React.ReactPortal | undefined;
export default RightClickPanel;
