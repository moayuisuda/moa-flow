import React from "react";
import { FlowContext } from "../Context";
export declare class LinkingEdge extends React.Component<{
    data: any;
}> {
    static contextType: React.Context<import("../Model").FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    constructor(props: any);
    render(): JSX.Element;
}
