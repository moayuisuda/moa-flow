import React from "react";
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
    static Port: any;
    constructor(props: any);
    render(): JSX.Element;
}
export default Interactor;
