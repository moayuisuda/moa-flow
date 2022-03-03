import React from "react";
declare type InteractorType = {
    x?: number;
    y?: number;
    id: string;
    draggable?: boolean;
    selectable?: boolean;
};
declare class Interactor extends React.Component<InteractorType, {}> {
    static contextType: React.Context<import("@/Context").FlowContextType>;
    static Port: any;
    syncDragPosition: (e: any) => void;
    render(): JSX.Element;
}
export default Interactor;
