import type { PathStyleProps } from "@antv/g";
import React, { Component } from "react";
declare type ArrowHead = boolean | React.ReactNode;
export interface ArrowStyleProps extends PathStyleProps {
    path: string;
    startHead?: ArrowHead;
    endHead?: ArrowHead;
}
export declare class Arrow extends Component<ArrowStyleProps, {}> {
    id: string;
    constructor(props: ArrowStyleProps);
    getArrowHead(head: ArrowHead, isStart: boolean): JSX.Element;
    getHeadId(isStart: boolean): "START" | "END";
    render(): JSX.Element;
    private getDefaultArrowHead;
}
export {};
