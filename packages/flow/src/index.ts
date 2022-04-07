"use strict";

import Flow from "./Flow";
import Cell from "./cells/Cell";
import Node from './cells/Node'
import Edge from './cells/Edge'
import Interactor from './scaffold/Interactor'
import Port from "./scaffold/Port";
import { PortType } from "./scaffold/Port";
import Model from "./Model";
import RightClickPanel from './components/RightClickPanel/index';

import ReactDOM from 'react-dom';
import React from "react";
import { NodeFlowState } from '@/types/common';

type ModelType = Model

const mountFlow = (container: Element, props) => {
    const modelRef = React.createRef<ModelType>()
    ReactDOM.render(React.createElement(Flow, { ...props, modelRef }), container)

    return { modelRef }
}

export {
    mountFlow,
    Flow,
    Cell,
    Port,
    Node,
    Edge,
    Interactor,
    RightClickPanel,
};

export type {
    NodeFlowState
}


export type { PortType, ModelType };
