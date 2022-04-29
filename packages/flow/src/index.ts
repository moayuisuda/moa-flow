"use strict";

import { Html } from 'react-konva-utils'

import Flow from "./Flow";
import Cell from "./cells/Cell";
import Node from './cells/Node'
import Edge from './cells/Edge'
import Interactor from './scaffold/Interactor'
import Port from "./scaffold/Port";
import { PortDataType } from "./scaffold/Port";
import Model from "./Model";

import RightClickPanel from './components/RightClickPanel/index';
import Image from './components/Image';

// import ReactDOM from 'react-dom';
// import React from "react";
import { NodeFlowState, FlowInfraEventType } from './types/common';

import * as Graph from 'react-konva'
import { autorun } from 'mobx';
import { Vector2d } from 'konva/lib/types';
import { CellDataType } from './cells/Cell';
import { EdgeDataType } from './cells/Edge';


type ModelType = Model

// const mountFlow = (container: Element, props) => {
//     const modelRef = React.createRef<ModelType>()
//     ReactDOM.render(React.createElement(Flow, { ...props, modelRef }), container)

//     return { modelRef }
// }

export {
    Flow,
    Cell,
    Port,
    Node,
    Edge,
    Interactor,
    Image,
    RightClickPanel,
    Graph,
    // mountFlow,
    autorun,
    Html,
};

export type { ModelType, FlowInfraEventType, Vector2d, CellDataType, EdgeDataType, PortDataType };
