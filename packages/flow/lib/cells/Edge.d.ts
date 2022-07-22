import { Dir, Vector2d } from "../typings/common";
import { PortDataType } from "../components";
import React from "react";
import { Arrow } from "../components";
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
    static defaultData: EdgeDataType;
    data: EdgeDataType;
    labelRef: React.RefObject<SVGTextElement>;
    arrowRef: React.RefObject<Arrow>;
    protected bazier: boolean | (() => boolean);
    protected startHead: Head | (() => Head);
    protected endHead: Head | (() => Head);
    lineDash: [number, number] | (() => [number, number]);
    protected animate: boolean | (() => boolean);
    pathInstance: SVGPathElement;
    isMountEvents: boolean;
    constructor(data: any, context: FlowModel);
    lineStyle({ isSelect }: {
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
        source: any;
        target: CellDataType | undefined;
    };
    protected route(vectors: Vector2d[]): Vector2d[];
    private vectorsToPoints;
    labelContent(): JSX.Element;
    labelStyle(): {};
    labelFormatter(label: string): string;
    isLinking(): boolean;
    getBazierDir(): {
        source: Dir;
        target: Dir;
    };
    getBazierPath(): string;
    labelPosition(): DOMPoint | {
        x: number;
        y: number;
    };
    getPolylinePath(): string;
    getPath(): string;
}
export declare const Edge: React.FC<{
    model: EdgeModel;
}>;
export {};
