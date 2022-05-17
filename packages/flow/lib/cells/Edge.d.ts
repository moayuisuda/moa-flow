import Cell, { CellDataType } from "./Cell";
import { NodeDataType } from "./Node";
import FlowModel from "../Model";
import { Dir, Vector2d } from "../typings/common";
import { Arrow, PortDataType } from "../components";
import React from "react";
import * as G from "@antv/g";
export declare type EdgeDataType = {
    source: string | Vector2d;
    target: string | Vector2d;
    label: string;
    verticies?: Vector2d[];
} & CellDataType;
declare type Head = React.ReactNode | boolean;
declare abstract class Edge<P = {}, S = {}> extends Cell<EdgeDataType & P, {} & S> {
    static metaData: any;
    labelRef: React.RefObject<G.Group>;
    arrowRef: React.RefObject<Arrow>;
    protected bazier: boolean | (() => boolean);
    protected startHead: Head | (() => Head);
    protected endhead: Head | (() => Head);
    protected lineDash: [number, number] | (() => [number, number]);
    protected animate: boolean | (() => boolean);
    pathInstance: G.Path;
    isMountEvents: boolean;
    constructor(props: {
        data: EdgeDataType;
    }, context: FlowModel);
    initAnimate(): void;
    componentDidMount(): void;
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
    protected route(vectors: Vector2d[]): Vector2d[];
    private vectorsToPoints;
    labelContent(): JSX.Element;
    labelStyle(): {};
    labelPosition(): G.Point | {
        x: number;
        y: number;
    } | null;
    protected labelRender(): JSX.Element;
    labelFormatter(label: string): string;
    isLinking(): any;
    getBazierDir(): {
        source: Dir;
        target: Dir;
    };
    getBazierPath(): string;
    lineExtra: () => JSX.Element;
    protected edgeRender({ points, }: {
        points: [number, number][];
        isLinking: boolean;
    }): JSX.Element;
    content(): JSX.Element;
}
export default Edge;
