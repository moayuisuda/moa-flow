import React from "react";
declare class ContextMenu extends React.Component<{
    children?: React.ReactNode;
}> {
    static contextType: React.Context<import("../../Model").FlowModel>;
    constructor(props: any);
    render(): JSX.Element;
}
export declare const getContextMenu: (children: React.ReactNode[] | React.ReactNode) => React.ReactChild | React.ReactFragment | React.ReactPortal | undefined;
export { ContextMenu };
