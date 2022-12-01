import Model, { FlowModel } from "./Model";
import { BehaviorName } from "./typings/common";
declare type MountTarget = "stage" | "window";
declare type EventMaps = Record<BehaviorName, {
    [index: string]: {
        handler: (e: any, model: FlowModel) => void | ((model: FlowModel) => void);
        mountTarget?: MountTarget;
        passive?: boolean;
        addStep?: boolean;
    };
}>;
export declare const behaviorsMap: EventMaps;
export declare const mountEvents: (behaviors: BehaviorName[], model: Model) => any;
export {};
