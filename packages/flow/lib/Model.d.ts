/// <reference types="react" />
import { CellType } from "@/cells/Cell";
export declare class FlowModel {
    constructor(eventSender: any);
    buffer: {
        link: {
            source: any;
            target: {
                x: number;
                y: number;
            };
        };
    };
    clearLinkBuffer: () => void;
    color: {
        primary: string;
        active: string;
        grey: string;
        blue: string;
        green: string;
        deepGrey: string;
    };
    cellsMap: Map<string, import("react").ReactNode>;
    cellsDataMap: Map<string, CellType>;
    componentsMap: Map<any, any>;
    eventBus: {
        sender: any;
        receiver: any;
    };
    selectCells: string[];
    setSelectedCells: (id: any) => void;
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
    setScale: (x: any, y: any) => void;
    setStagePosition: (x: any, y: any) => void;
    setCanvasData: (canvasData: any) => void;
    setCellId: (data: any) => void;
    setCellData: (id: any, data: any) => void;
    deleCell: (id: any) => void;
    setAutoLayout: (layoutOption: any) => void;
    createCellData: (component: any, initOptions?: any) => any;
    addCell: (componentName: any, initOptions: any) => void;
    setLinkingPosition: (e: any) => void;
    link: (source: any, target: any) => void;
    moveTo(id: any, index: any): void;
    getCellData: (id: any) => CellType;
    onConnect(data: any): void;
}
export default FlowModel;
