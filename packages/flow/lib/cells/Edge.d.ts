import Cell from "./Cell";
import { CellDataType } from "./Cell";
import { PortDataType } from "../scaffold/Port";
import React from "react";
import Konva from "konva";
import { NodeDataType } from "./Node";
import { Vector2d } from "konva/lib/types";
import FlowModel from "../Model";
export declare type EdgeDataType = {
    source: string | Vector2d;
    target: string | Vector2d;
    label: string;
    verticies?: Vector2d[];
} & CellDataType;
declare abstract class Edge<P = {}, S = {}> extends Cell<EdgeDataType & P, {} & S> {
    static metaData: any;
    labelRef: React.RefObject<Konva.Group>;
    protected bazier: boolean;
    protected arrow: boolean;
    protected dash: boolean;
    isMountEvents: boolean;
    constructor(props: {
        data: EdgeDataType;
    }, context: FlowModel);
    protected lineStyle({ isSelect }: {
        isSelect: boolean;
    }): {
        stroke: string;
    } | {
        stroke?: undefined;
    };
    protected formatVerticied: (verticies: Vector2d[]) => Vector2d[];
    getLinkPortsData: () => {
        source: Vector2d | PortDataType;
        target: Vector2d | PortDataType;
    };
    getAnchors: () => {
        source: any;
        target: any;
    };
    private getPoints;
    getVectors(): any[];
    getLinkNodesData(): {
        source: NodeDataType | undefined;
        target: NodeDataType | undefined;
    };
    protected route(vectors: Konva.Vector2d[]): Vector2d[];
    private vectorsToPoints;
    labelContent(): JSX.Element;
    labelStyle(): {};
    labelPosition(): {
        x: number;
        y: number;
    };
    protected labelRender(): JSX.Element;
    labelFormatter(label: string): string;
    isLinking(): boolean;
    lineExtra: () => JSX.Element;
    protected edgeRender({ points, isLinking, }: {
        points: [number, number][];
        isLinking: boolean;
    }): JSX.Element;
    content(): JSX.Element;
}
export default Edge;
