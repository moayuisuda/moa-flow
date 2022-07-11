import type * as G from "@antv/g";
import type { DisplayObject, PathStyleProps } from "@antv/g";
import React, { Component } from "react";
declare type ArrowHead = boolean | React.ReactNode;
export interface ArrowStyleProps extends PathStyleProps {
    path: string;
    startHead?: ArrowHead;
    endHead?: ArrowHead;
}
export declare class Arrow extends Component<ArrowStyleProps, {}> {
    startRef: React.MutableRefObject<DisplayObject | null>;
    endRef: React.MutableRefObject<DisplayObject | null>;
    bodyRef: React.MutableRefObject<G.Path | null>;
    constructor(props: ArrowStyleProps);
    getArrowHead(head: ArrowHead, isStart: boolean): ArrowHead;
    setHeadTransform(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    getCenter(): G.Point | null;
    private transformArrowHead;
    private getTangent;
    private getDefaultArrowHead;
}
export {};
