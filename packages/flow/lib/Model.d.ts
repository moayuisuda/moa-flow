import React from "react";
import { CellDataType } from "./cells/Cell";
import Konva from "konva";
import { CanvasDataType, AllCellDataType } from "./types/common";
declare type EventSender = (data: any) => void;
export declare class FlowModel {
    extraContext: {};
    constructor(eventSender?: EventSender);
    setEventSender: (eventSender: EventSender) => void;
    setCellsDataMap: () => void;
    setCellDataMap(cellData: AllCellDataType): void;
    _width: number;
    _height: number;
    width: (width?: number | undefined) => number;
    height: (height?: number | undefined) => number;
    setSize: (width: number, height: number) => void;
    grid: number | undefined;
    setGrid: (grid: number) => void;
    refs: {
        stageRef: React.RefObject<import("konva/lib/Stage").Stage> | undefined;
        nodesLayerRef: React.RefObject<import("konva/lib/Layer").Layer> | undefined;
        linesLayerRef: React.RefObject<import("konva/lib/Layer").Layer> | undefined;
    };
    hotKey: {
        RightMouseDown: boolean;
        LeftMouseDown: boolean;
        Space: boolean;
    };
    setHotKey: (key: "RightMouseDown" | "LeftMouseDown" | "Space", value: boolean) => void;
    linkEdge: string;
    setLinkEdge: (name: string) => void;
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
            movedToTop: boolean;
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
        start?: Konva.Vector2d;
        end?: Konva.Vector2d;
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
    regist: (name: string, component: Cell) => void;
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
    setCanvasData: (canvasData: CanvasDataType) => void;
    setCellId: (data: CellDataType) => void;
    setCellData: (id: string, data: any) => void;
    getNodeEdges: (nodeId: string) => string[];
    getLinkNodes: (id: string) => string[];
    deleCell: (id: string) => string | undefined;
    snap: (vector: Konva.Vector2d) => {
        x: number;
        y: number;
    };
    createCellData: (component: string, initOptions?: any) => any;
    addCell: (componentName: string, initOptions: any) => any;
    setLinkingPosition: (e: any) => void;
    link: (source: string, target: string) => void;
    scale: (scale?: number | undefined) => number;
    x(x?: number): number;
    y(y?: number): number;
    moveTo(id: string, index: number): void;
    getCell: (id: string) => any;
    getCellData: (id: string) => CellDataType | undefined;
    getCellInstance: (id: string) => any;
    getCellsData: () => any[];
}
export default FlowModel;
