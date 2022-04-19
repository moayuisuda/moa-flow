import React from "react";
import { FlowContext } from "../Context";
declare class LinkingEdge extends React.Component<{
    data: any;
}> {
    static contextType: React.Context<import("../Model").FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    render(): JSX.Element;
}
export default LinkingEdge;
