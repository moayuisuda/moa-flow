import React from "react";
import { CellType } from "@/cells/Cell";
export declare class FlowModel {
    constructor(eventSender?: any);
    setEventSender: (eventSender: any) => void;
    setCellsDataMap: () => void;
    setCellDataMap: (cellData: any) => void;
    refs: {
        stageRef: React.RefObject<import("konva/lib/Stage").Stage>;
        nodesLayerRef: React.RefObject<import("konva/lib/Layer").Layer>;
        linesLayerRef: React.RefObject<import("konva/lib/Layer").Layer>;
    };
    hotKey: {
        RightMouseDown: boolean;
        LeftMouseDown: boolean;
        Space: boolean;
    };
    setHotKey: (key: any, value: any) => void;
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
            edge: any;
            source: any;
            target: {
                x: number;
                y: number;
            };
        };
    };
    setMultiSelect: (select: any, onlySetPosition?: boolean) => void;
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
    cellsMap: Map<string | Symbol, any>;
    cellsDataMap: Map<string | Symbol, CellType>;
    componentsMap: Map<any, any>;
    eventBus: {
        sender: any;
        receiver: any;
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
        cells: any[];
    };
    clearSelect: () => void;
    sendEvent: (data: any) => void;
    setStageScale: (x: any, y: any) => void;
    setStagePosition: (x: any, y: any) => void;
    setCanvasData: (canvasData: any) => void;
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
    getCellData: (id: any) => CellType;
    getCellInstance: (id: any) => any;
}
export default FlowModel;
