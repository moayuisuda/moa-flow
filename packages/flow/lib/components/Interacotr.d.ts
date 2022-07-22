import React from "react";
import { FlowContext } from "../Context";
import { Port } from "./Port";
declare type InteractorType = {
    id: string;
    inSvg?: boolean;
    topOnFocus?: boolean;
    children: React.ReactNode;
};
export declare class Interactor extends React.Component<InteractorType> {
    static contextType: React.Context<import("../Model").FlowModel>;
    context: React.ContextType<typeof FlowContext>;
    static Port: typeof Port;
    constructor(props: InteractorType);
    render(): JSX.Element;
}
export {};
