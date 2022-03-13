import { CellType } from "@/cells/Cell";
export declare class FlowModel {
    constructor(eventSender: any);
    hotKey: {};
    registedEdge: undefined;
    buffer: {
        select: {
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
            source: any;
            target: {
                x: number;
                y: number;
            };
        };
    };
    setMultiSelect: (select: any) => void;
    clearLinkBuffer: () => void;
    color: {
        primary: string;
        active: string;
        grey: string;
        blue: string;
        green: string;
        deepGrey: string;
    };
    cellsMap: Map<string, any>;
    cellsDataMap: Map<string, CellType>;
    componentsMap: Map<any, any>;
    eventBus: {
        sender: any;
        receiver: any;
    };
    selectCells: string[];
    setSelectedCells: (id: any, isSingleSelect?: boolean) => void;
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
    deleCell: (id: any) => any;
    setAutoLayout: (layoutOption: any) => void;
    createCellData: (component: any, initOptions?: any) => any;
    addCell: (componentName: any, initOptions: any) => any;
    setLinkingPosition: (e: any) => void;
    link: (source: any, target: any) => void;
    moveTo(id: any, index: any): void;
    getCellData: (id: any) => CellType;
    getCellInstance: (id: any) => any;
    onConnect(data: any): void;
}
export default FlowModel;
