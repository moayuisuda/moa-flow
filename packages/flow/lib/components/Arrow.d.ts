import type { DisplayObject, BaseStyleProps } from "@antv/g";
import React, { Component } from "react";
declare type ArrowHead = boolean | DisplayObject;
declare type ArrowBody = React.ReactElement;
export interface ArrowStyleProps extends BaseStyleProps {
    type: "Path" | "Line" | "Polyline";
    body?: ArrowBody;
    startHead?: ArrowHead;
    endHead?: ArrowHead;
    stroke?: string;
    lineWidth?: number;
    opacity?: number;
    strokeOpacity?: number;
}
/**
 * support 3 types of arrow line:
 * 1. Line
 * 2. Polyline
 * 3. Path
 *
 * support 2 types of arrow head:
 * 1. default(Path)
 * 2. custom
 */
export default class Arrow extends Component<ArrowStyleProps, {}> {
    startRef: React.MutableRefObject<DisplayObject | null>;
    endRef: React.MutableRefObject<DisplayObject | null>;
    bodyRef: React.MutableRefObject<DisplayObject | null>;
    constructor(props: ArrowStyleProps);
    getArrowHead(head: ArrowHead, isStart: boolean): JSX.Element | ArrowHead | undefined;
    setHeadTransform(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    /**
     * transform arrow head according to arrow line
     */
    private transformArrowHead;
    private getTangent;
    private getDefaultArrowHead;
}
export {};
