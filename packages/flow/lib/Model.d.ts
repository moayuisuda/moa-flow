import React from "react";
import { CellDataType } from "./cells/Cell";
import { CanvasDataType, AllCellDataType, Vector2d } from "./types/common";
import { InteractivePointerEvent } from "@antv/g";
import * as G from "@antv/g";
declare type EventSender = (data: any) => void;
export declare class FlowModel {
    constructor(eventSender?: EventSender);
    setEventSender: (eventSender: EventSender) => void;
    setCellsDataMap: () => void;
    setCellDataMap(cellData: AllCellDataType): void;
    extra: any;
    _width: number;
    _height: number;
    width: (width?: number | undefined) => number;
    height: (height?: number | undefined) => number;
    setSize: (width: number, height: number) => void;
    grid: number | undefined;
    setGrid: (grid: number) => void;
    refs: {
        stageRef: React.RefObject<G.Canvas> | undefined;
    };
    hotKey: {
        RightMouseDown: boolean;
        LeftMouseDown: boolean;
        Space: boolean;
    };
    setHotKey: (key: "RightMouseDown" | "LeftMouseDown" | "Space", value: boolean) => void;
    linkEdge: string;
    setLinkEdge: (name: string) => void;
    getLinkingPort: () => string | undefined;
    clearPortEdge: (edgeId: string) => void;
    buffer: {
        rightClickPanel: {
            visible: boolean;
        };
        drag: {
            movement: {
                x: number;
                y: number;
            };
            start: {
                x: number;
                y: number;
            };
        };
        isWheeling: boolean;
        select: {
            isSelecting: boolean;
            start: {
                x: number;
                y: number;
            };
            end: {
                x: number;
                y: number;
            };
        };
        link: {
            $state: {
                isSelect: boolean;
                isLinking: boolean;
            };
            edge: string | undefined;
            source: string | undefined;
            target: {
                x: number;
                y: number;
            };
        };
    };
    setMultiSelect: (select: {
        isSelecting?: boolean;
        start?: Vector2d;
        end?: Vector2d;
    }, onlySetPosition?: boolean) => void;
    clearLinkBuffer: () => void;
    color: {
        primary: string;
        active: string;
        grey: string;
        blue: string;
        green: string;
        deepGrey: string;
        background: string;
    };
    cellsMap: Map<string, any>;
    cellsDataMap: Map<string, CellDataType>;
    componentsMap: Map<any, any>;
    regist: (name: string, component: any) => void;
    eventBus: {
        sender: EventSender | undefined;
        receiver: undefined;
    };
    selectCells: string[];
    setSelectedCells: (ids: string[], ifReplace?: boolean) => void;
    canvasData: CanvasDataType;
    clearSelect: () => void;
    sendEvent: (data: any) => void;
    setStageScale: (scale: number) => void;
    setStagePosition: (x: number, y: number) => void;
    insertRuntimeState: (cellData: CellDataType) => void;
    getLocalBBox: (id: string) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    setCanvasData: (canvasData: CanvasDataType) => void;
    setCellId: (data: CellDataType) => void;
    setCellData: (id: string, data: any) => void;
    /**
     * @description 获取某个node连接的所有edge
     */
    getNodeEdges: (nodeId: string) => string[];
    /**
     * @description 获取某个port连接的所有port
     */
    getPortLinkPorts: (portId: string) => string[];
    /**
     * @description 获取某个port连接的所有node
     */
    getPortLinkNodes: (portId: string) => string[];
    /**
     * @description 获取某个node连接的所有port
     */
    getLinkPorts: (nodeId: string) => string[];
    /**
     * @description 获取某个node连接的所有node
     */
    getLinkNodes: (nodeId: string) => string[];
    deleCell: (id: string) => string | undefined;
    snap: (vector: Vector2d) => {
        x: number;
        y: number;
    };
    createCellData: (component: string, initOptions?: any) => any;
    addCell: (componentName: string, initOptions: any) => any;
    setLinkingPosition: (e: InteractivePointerEvent) => void;
    link: (source: string, target: string) => void;
    scale: (scale?: number | undefined) => any;
    x(x?: number): any;
    y(y?: number): any;
    moveTo(id: string, index: number): void;
    getCell: (id: string) => any;
    getCellData: (id: string) => CellDataType | undefined;
    getCellInstance: (id: string) => any;
    getCellsData: () => any;
    /**
     * @description 获取当前鼠标的[画布坐标]
     */
    getStageCursor: (e: InteractivePointerEvent) => {
        x: number;
        y: number;
    };
}
export default FlowModel;
