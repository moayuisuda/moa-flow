/// <reference types="react" />
import Cell from "./Cell";
declare type EdgeType = {
    source: string;
    target: string;
};
declare class LinkingEdge extends Cell<EdgeType, {
    points: number[];
}> {
    constructor(props: any, context: any);
    getStroke: () => {
        stroke: any;
    } | {
        stroke?: undefined;
    };
    getPoints(): any[];
    edgeRender(): JSX.Element;
    content(): JSX.Element;
}
export default LinkingEdge;
