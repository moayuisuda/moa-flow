import Cell from "./Cell";
import { CellType } from "./Cell";
import { NodeFlowState } from "@/types/common";
import React from "react";
import Konva from "konva";
import { NodeType } from "./Node";
export declare type EdgeType = {
    source: string;
    target: string;
    label: string;
} & CellType;
declare abstract class Edge<P = {}, S = {}> extends Cell<EdgeType & P, {
    points: number[];
} & S> {
    static metaData: any;
    labelRef: React.RefObject<Konva.Group>;
    protected bazier: boolean;
    protected dash: boolean;
    constructor(props: any, context: any);
    protected getStroke: (flowState: NodeFlowState) => {
        stroke: string;
    } | {
        stroke?: undefined;
    };
    private getAnchors;
    protected getPoints(): any[];
    getLinkNodesData(): {
        source: NodeType;
        target: NodeType;
    };
    protected route(sourceAnchor: any, targetAnchor: any): any[];
    labelContent(): JSX.Element;
    protected labelRender(anchors: any): JSX.Element;
    labelFormatter(label: any): any;
    protected edgeRender(points: any): JSX.Element;
    content(): JSX.Element;
}
export default Edge;
