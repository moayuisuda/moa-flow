import { Dir, Vector2d } from "../typings/common";
import { PortDataType } from "../components";
import React from "react";
import { CellModel, CellDataType } from "./Cell";
import { FlowModel } from "Model";
export declare type EdgeDataType = {
    source: string | Vector2d;
    target: string | Vector2d;
    label: string;
    verticies?: Vector2d[];
} & CellDataType;
export declare type EdgeData<D> = D & EdgeDataType;
declare type Head = React.ReactNode | boolean;
export declare class EdgeModel<D extends EdgeDataType = EdgeDataType> extends CellModel {
    defaultData: () => any;
    data: D;
    protected bazier: boolean | (() => boolean);
    protected startHead: Head | (() => Head);
    protected endHead: Head | (() => Head);
    pathInstance: SVGPathElement;
    constructor(data: any, context: FlowModel);
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
    getVectors: () => any[];
    getLinkNodes: () => {
        source: string | undefined;
        target: string | undefined;
    };
    route(vectors: Vector2d[]): Vector2d[];
    private vectorsToPoints;
    getPointAt: (ratioOrLength: number) => DOMPoint;
    labelContent: () => JSX.Element;
    label(label: string): string;
    isLinking: () => boolean;
    controlPointOffset: () => number;
    getBazierDir: () => {
        source: Dir;
        target: Dir;
    };
    getBazierPath: () => string;
    getPolylinePath: () => string;
    get d(): string;
    defaultLineProps: () => {
        strokeLinecap: string;
        strokeLinejoin: string;
        fill: string;
        strokeWidth: number;
        stroke: string;
    };
    lineProps: () => {};
}
export declare const Edge: React.FC<{
    model: EdgeModel;
}>;
export {};
