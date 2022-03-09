import Flow from "./Flow";
import Cell from "./cells/Cell";
import Node from './cells/Node';
import Interactor from './scaffold/Interactor';
import Port from "./scaffold/Port";
import { PortType } from "./scaffold/Port";
import Model from "./Model";
import React from "react";
declare type ModelType = Model;
declare const mountFlow: (container: Element, props: any) => {
    modelRef: React.RefObject<unknown>;
};
export { mountFlow, Flow, Cell, Port, Node, Interactor, };
export type { PortType, ModelType };
