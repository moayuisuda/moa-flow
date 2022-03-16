import { CellType } from "@/cells/Cell";
export declare class FlowModel {
    constructor(eventSender: any);
    hotKey: {
        MouseDown: boolean;
    };
    setHotKey: (key: any, value: any) => void;
    linkEdge: string;
    setLinkEdge: (name: string) => void;
    buffer: {
        isDragging: boolean;
        isSingleSelect: boolean;
        select: {
            single: boolean;
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
    setisSingleSelect: (isisSingleSelect: boolean) => void;
    setMultiSelect: (select: any, onlySetPosition?: boolean) => void;
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
    deleCell: (id: any) => any;
    setAutoLayout: (layoutOption: any) => void;
    createCellData: (component: any, initOptions?: any) => any;
    addCell: (componentName: any, initOptions: any) => any;
    setLinkingPosition: (e: any) => void;
    link: (source: any, target: any) => void;
    moveTo(id: any, index: any): void;
    getCellData: (id: any) => CellType;
    getCellInstance: (id: any) => any;
    getPortNode(id: any): any;
    getPortEdges(id: any): any[];
    onConnect(data: any): void;
}
export default FlowModel;
