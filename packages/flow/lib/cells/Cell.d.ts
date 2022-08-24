/// <reference types="react" />
import { FlowModel } from "../Model";
export declare type CellDataType = {
    id: string;
    cellType: string;
    component: string;
    [key: string]: any;
};
export declare class CellModel {
    defaultData: () => any;
    context: FlowModel;
    data: CellDataType;
    state: {
        isSelect: boolean;
        isLinking: boolean;
    };
    constructor(data: any, context: FlowModel);
    get isSelect(): boolean;
    set isSelect(isSelect: boolean);
    getWrapperRef: () => import("react").RefObject<HTMLDivElement>;
    setData: (data: any, rec?: boolean) => void;
    static getDefaultData(): CellDataType;
}
