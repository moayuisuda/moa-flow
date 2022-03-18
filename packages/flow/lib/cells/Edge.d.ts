/// <reference types="react" />
import Cell from "./Cell";
import { CellType } from "./Cell";
export declare type EdgeType = {
    source: string;
    target: string;
} & CellType;
declare class Edge<P, S> extends Cell<EdgeType & P, {
    points: number[];
} & S> {
    static metaData: any;
    protected bazier: boolean;
    protected dash: boolean;
    constructor(props: any, context: any);
    private getStroke;
    protected getPoints(): any[];
    route(sourceAnchor: any, targetAnchor: any): any[];
    protected edgeRender(): JSX.Element;
    content(): JSX.Element;
}
export default Edge;
