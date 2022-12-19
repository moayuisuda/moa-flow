/// <reference types="lodash" />
import React from "react";
import { CellDataType, CellModel } from "./cells/Cell";
import { Port } from "./components";
import { AllCellDataType, CanvasDataType, Vector2d } from "./typings/common";
declare type EventSender = (data: any) => void;
export declare class FlowModel {
    eventMap: Map<string, Map<string, Function>>;
    constructor(eventSender?: EventSender);
    setEventSender: (eventSender: EventSender) => void;
    setCellsDataMap: () => void;
    setCellDataMap(cellData: AllCellDataType): void;
    extra: any;
    isInitEvents: boolean;
    multiSelect: boolean;
    scaleBy: number;
    pendingRender: boolean;
    trigRender: () => void;
    pendRender: () => void;
    private _width;
    get width(): number;
    set width(width: number);
    private _height;
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
    private _grid;
    get grid(): number;
    set grid(grid: number);
    private _linkEdge;
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
    setContextMenuPos: (pos: Vector2d) => void;
    get contextMenuPos(): {
        x: number;
        y: number;
    };
    refs: {
        stageRef: HTMLDivElement | null;
        svgContainerRef: SVGElement | null;
        divContainerRef: HTMLDivElement | null;
    };
    hotKey: {
        RightMouseDown: boolean;
        LeftMouseDown: boolean;
        Space: boolean;
        MetaLeft: boolean;
        ControlLeft: boolean;
    };
    setHotKey: (key: "RightMouseDown" | "LeftMouseDown" | "Space" | "MetaLeft" | "ControlLeft", value: boolean) => void;
    getLinkingPort: () => string | undefined;
    clearPortEdge: (edgeId: string) => void;
    buffer: {
        debug: {
            x: number;
            y: number;
        };
        contextMenu: {
            visible: boolean;
            x: number;
            y: number;
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
            selectingDom: undefined;
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
    isSelecting(e: any): boolean;
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
        deepGrey: string;
        background: string;
        success: string;
        error: string;
    };
    getWrapperRef: (id: string) => React.RefObject<HTMLDivElement>;
    wrapperRefsMap: Map<string, {
        current: HTMLDivElement | null;
    }>;
    cellsMap: Map<string, any>;
    cellsModelMap: Map<string, CellModel>;
    cellsDataMap: Map<string, CellDataType>;
    componentsMap: Map<string, typeof Port | React.FC<{}>>;
    modelFactoriesMap: Map<string, typeof CellModel>;
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
    /**
     * @description 获取当前鼠标的[画布坐标]
     */
    getCursorCoord: (e: React.MouseEvent, isCanvasCoord?: boolean) => {
        x: number;
        y: number;
    };
    fit: (nodeWidth: number, nodeHeight: number) => void;
    getLocalBBox: (id: string) => import("./utils/coords").BoundingBox;
    isCellExist: (id: string) => any;
    setCanvasData: (canvasData: CanvasDataType) => void;
    setCellId: (data: CellDataType) => void;
    setCellData: (id: string, data: any, deepMerge?: boolean) => void;
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
    setLayout: (layout: any) => never[] | undefined;
    getNodesData: () => any[];
    getEdgesData: () => any[];
    createCellData: (component: string, initOptions?: any) => any;
    addCell: (componentName: string, initOptions?: any) => any;
    setLinkingPosition: (coord: Vector2d) => void;
    link: (source: string, target: string) => any;
    setStagePosition: (x: number, y: number) => void;
    /**
     *
     * @description 调整某个Cell的层级
     */
    moveTo: (id: string, index: number) => void;
    getCell: (id: string) => any;
    getCellData: (id: string) => CellDataType | undefined;
    getCellModel: (id: string) => CellModel | undefined;
    getPortInstance: (id: string) => any;
    getCellsData: () => any[];
    getNodePosition: (id: string) => {
        x: any;
        y: any;
    };
    moveNodesRecursively: (nodeId: string, movement: Vector2d) => void;
    sendEvent: (cellId: string, params?: any) => void;
    registModels: (models: Record<string, typeof CellModel>) => void;
    registComponents: (components: Record<string, React.FC>) => void;
    fitParentSize: () => void;
    private undoList;
    private redoList;
    addStep: import("lodash").DebouncedFunc<() => void>;
    undo: () => void;
    redo: () => void;
}
export default FlowModel;
