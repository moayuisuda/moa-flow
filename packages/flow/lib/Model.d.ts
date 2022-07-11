import G, { InteractivePointerEvent } from "@antv/g";
import React from "react";
import { CellDataType } from "./cells/Cell";
import { AllCellDataType, CanvasDataType, Vector2d } from "./typings/common";
declare type EventSender = (data: any) => void;
export declare class FlowModel {
    eventMap: Map<string, Map<string, Function>>;
    constructor(eventSender?: EventSender);
    setEventSender: (eventSender: EventSender) => void;
    setCellsDataMap: () => void;
    setCellDataMap(cellData: AllCellDataType): void;
    extra: any;
    pendingRender: boolean;
    trigRender(): void;
    pendRender(): void;
    _width: number;
    get width(): number;
    set width(width: number);
    _height: number;
    get height(): number;
    set height(height: number);
    get size(): {
        width: number;
        height: number;
    };
    set size(size: {
        width: number;
        height: number;
    });
    _grid: number;
    get grid(): number;
    set grid(grid: number);
    _linkEdge: string;
    get linkEdge(): string;
    set linkEdge(linkEdge: string);
    get scale(): number;
    set scale(scale: number);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get contextMenuVisible(): boolean;
    set contextMenuVisible(visible: boolean);
    refs: {
        stageRef: React.RefObject<G.Canvas> | undefined;
    };
    hotKey: {
        RightMouseDown: boolean;
        LeftMouseDown: boolean;
        Space: boolean;
    };
    setHotKey: (key: "RightMouseDown" | "LeftMouseDown" | "Space", value: boolean) => void;
    getLinkingPort: () => string | undefined;
    clearPortEdge: (edgeId: string) => void;
    buffer: {
        contextMenu: {
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
        deepGrey: string;
        background: string;
        success: string;
        error: string;
    };
    getWrapperRef: (id: string) => {
        current: G.Group | null;
    } | undefined;
    wrapperRefsMap: Map<string, {
        current: G.Group | null;
    }>;
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
    clearSelect: () => void;
    canvasData: CanvasDataType;
    emitEvent: (data: any) => void;
    setStageScale: (scale: number) => void;
    insertRuntimeState: (cellData: CellDataType) => void;
    getLocalBBox: (id: string) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    setCanvasData: (canvasData: CanvasDataType) => void;
    setCellId: (data: CellDataType) => void;
    setCellData: (id: string, data: any, rec?: boolean) => void;
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
    addCell: (componentName: string, initOptions?: any) => any;
    setLinkingPosition: (e: InteractivePointerEvent) => void;
    link: (source: string, target: string) => void;
    setStagePosition: (x: number, y: number) => void;
    moveTo(id: string, index: number): void;
    getCell: (id: string) => any;
    getCellData: (id: string) => CellDataType | undefined;
    getCellInstance: (id: string) => any;
    getCellsData: () => any[];
    getNodePosition: (id: string) => {
        x: number;
        y: number;
    };
    sendEvent: (cellId: string, params?: any) => void;
    /**
     * @description 获取当前鼠标的[画布坐标]
     */
    getStageCursor: (e: InteractivePointerEvent) => {
        x: number;
        y: number;
    };
}
export default FlowModel;
