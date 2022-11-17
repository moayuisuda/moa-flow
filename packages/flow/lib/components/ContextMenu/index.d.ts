import React from "react";
declare class ContextMenu extends React.Component<{
    children?: React.ReactNode;
}> {
    static contextType: React.Context<import("../../Model").FlowModel>;
    wrapperRef: React.RefObject<HTMLDivElement>;
    constructor(props: any);
    isOutClient(): {
        x: boolean;
        y: boolean;
    };
    setTransform(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export declare const getContextMenu: (children: React.ReactNode[] | React.ReactNode) => React.ReactChild | React.ReactFragment | React.ReactPortal | undefined;
export { ContextMenu };
