import React from "react";
declare type FlowProps = {
    canvasData: any;
    onEvent: (e: any) => void;
    modelRef: any;
};
declare class Flow extends React.Component<FlowProps, {}> {
    eventBus: any;
    flowModel: any;
    constructor(props: FlowProps);
    render(): JSX.Element;
}
export default Flow;
