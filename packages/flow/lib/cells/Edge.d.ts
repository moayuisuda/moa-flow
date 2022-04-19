import Cell from "./Cell";
import { CellType } from "./Cell";
import { NodeFlowState } from "../types/common";
import React from "react";
import Konva from "konva";
import { NodeType } from "./Node";
export declare type EdgeType = {
    source: string | Konva.Vector2d;
    target: string | Konva.Vector2d;
    label: string;
    verticies?: Konva.Vector2d[];
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
    protected formatVerticied: (verticies: any) => any;
    getAnchors: () => {
        source: any;
        target: any;
    };
    private getPoints;
    getVectors(): any[];
    getLinkNodesData(): {
        source: NodeType | undefined;
        target: NodeType | undefined;
    };
    protected route(vectors: Konva.Vector2d[]): import("konva/lib/types").Vector2d[];
    private vectorsToPoints;
    labelContent(): JSX.Element;
    protected labelRender(anchors: any): JSX.Element;
    labelFormatter(label: any): any;
    isLinking(): boolean;
    lineExtra: () => JSX.Element;
    protected edgeRender({ points, isLinking }: {
        points: any;
        isLinking: any;
    }): JSX.Element;
    content(): JSX.Element;
}
export default Edge;
