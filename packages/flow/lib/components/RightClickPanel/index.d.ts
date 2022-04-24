import Konva from "konva";
import React from "react";
import Model from "../../Model";
declare class RightClickPanel extends React.Component<{
    stage?: Konva.Stage;
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
