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
    static contextType: React.Context<import("@/Context").FlowContextType>;
    static Port: any;
    local: {
        isDragging: boolean;
    };
    syncDragPosition: (e: any) => void;
    constructor(props: any);
    render(): JSX.Element;
}
export default Interactor;
