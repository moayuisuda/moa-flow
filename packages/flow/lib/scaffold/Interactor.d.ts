import React from "react";
import { FlowContext } from "@/Context";
declare type InteractorType = {
    x?: number;
    y?: number;
    id: string;
    draggable?: boolean;
    selectable?: boolean;
    topOnFocus?: boolean;
};
declare class Interactor extends React.Component<InteractorType> {
    static contextType: React.Context<import("../Model").FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    static Port: any;
    constructor(props: any);
    render(): JSX.Element;
}
export default Interactor;
