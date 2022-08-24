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
declare type Head = React.ReactNode | boolean;
export declare class EdgeModel extends CellModel {
    defaultData: () => {
        id: string;
        component: string;
        source: string;
        target: string;
        label: string;
        verticies: never[];
        cellType: string;
    };
    data: EdgeDataType;
    protected bazier: boolean | (() => boolean);
    protected startHead: Head | (() => Head);
    protected endHead: Head | (() => Head);
    pathInstance: SVGPathElement;
    isMountEvents: boolean;
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
    getLinkNodesData: () => {
        source: any;
        target: CellDataType | undefined;
    };
    route(vectors: Vector2d[]): Vector2d[];
    private vectorsToPoints;
    getPointAt: (ratio: number) => DOMPoint;
    labelContent: () => JSX.Element;
    label(label: string): string;
    isLinking: () => boolean;
    getBazierDir: () => {
        source: Dir;
        target: Dir;
    };
    getBazierPath: () => string;
    getPolylinePath: () => string;
    get d(): string;
}
export declare const Edge: React.FC<{
    model: EdgeModel;
}>;
export {};
