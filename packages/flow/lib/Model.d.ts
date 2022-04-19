import React from "react";
import { CellType } from "./cells/Cell";
import { NodeType } from "./cells/Node";
import Konva from "konva";
import { CanvasDataType } from "./types/common";
declare type EventSender = (data: any) => void;
export declare class FlowModel {
    constructor(eventSender?: EventSender);
    setEventSender: (eventSender: EventSender) => void;
    setCellsDataMap: () => void;
    setCellDataMap: (cellData: NodeType) => void;
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
    cellsDataMap: Map<string, CellType>;
    componentsMap: Map<any, any>;
    regist: (component: Cell) => void;
    eventBus: {
        sender: EventSender | undefined;
        receiver: undefined;
    };
    selectCells: string[];
    setSelectedCells: (ids: string[], ifReplace?: boolean) => void;
    canvasData: {
        scale: {
            x: number;
            y: number;
        };
        x: number;
        y: number;
        cells: never[];
    };
    clearSelect: () => void;
    sendEvent: (data: any) => void;
    setStageScale: (x: number, y: number) => void;
    setStagePosition: (x: number, y: number) => void;
    setCanvasData: (canvasData: CanvasDataType) => void;
    setCellId: (data: any) => void;
    setCellData: (id: any, data: any) => void;
    getEdges: (id: any) => any[];
    getLinkNodes: (id: any) => any[];
    deleCell: (id: any) => any;
    deleEdge: (id: any) => void;
    setAutoLayout: (layoutOption: any) => void;
    createCellData: (component: any, initOptions?: any) => any;
    addCell: (componentName: any, initOptions: any) => any;
    setLinkingPosition: (e: any) => void;
    link: (source: any, target: any) => void;
    moveTo(id: any, index: any): void;
    getCellData: (id: any) => CellType | undefined;
    getCellInstance: (id: any) => any;
}
export default FlowModel;
