import React from "react";
import { FlowContext } from "../Context";
import { Port } from "./Port";
declare type InteractorType = {
    x?: number;
    y?: number;
    id: string;
    draggable?: boolean;
    selectable?: boolean;
    topOnFocus?: boolean;
};
export declare class Interactor extends React.Component<InteractorType> {
    static contextType: React.Context<import("../Model").FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    static Port: typeof Port;
    constructor(props: InteractorType);
    render(): JSX.Element;
}
export {};
