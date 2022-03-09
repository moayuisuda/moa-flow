"use strict";

import Flow from "./Flow";
import Cell from "./cells/Cell";
import Node from './cells/Node'
import Interactor from './scaffold/Interactor'
import Port from "./scaffold/Port";
import { PortType } from "./scaffold/Port";
import Model from "./Model";

import ReactDOM from 'react-dom';
import React from "react";

type ModelType = Model

const mountFlow = (container: Element, props) => {
    const modelRef = React.createRef()
    ReactDOM.render(React.createElement(Flow, { ...props, modelRef }), container)

    return { modelRef }
}

export {
    mountFlow,
    Flow,
    Cell,
    Port,
    Node,
    Interactor,
};


export type { PortType, ModelType };
