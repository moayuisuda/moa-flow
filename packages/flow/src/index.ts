"use strict";

import Flow from "./Flow";
import Cell from "./cells/Cell";
import Node from './cells/Node'
import Edge from './cells/Edge'
import Interactor from './scaffold/Interacotr'
import Port from "./scaffold/Port";
import { PortDataType } from "./scaffold/Port";
import Model from "./Model";
import Portal from "components/Portal";

import RightClickPanel from './components/RightClickPanel/index';
import Image from './components/Image';

import { FlowInfraEventType } from './types/common';

import * as Graph from '@antv/react-g'
import { autorun } from 'mobx';
import { Vector2d } from './types/common';
import { CellDataType } from './cells/Cell';
import { EdgeDataType } from './cells/Edge';
import { NodeDataType } from './cells/Node';
import { Canvas } from './Flow';
import ConsumerBridge from './components/ConsumerBridge';


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
    Portal,
    Image,
    RightClickPanel,
    Graph,
    autorun,
    Canvas,
    ConsumerBridge
};

export type { ModelType, FlowInfraEventType, Vector2d, CellDataType, EdgeDataType, PortDataType, NodeDataType };
