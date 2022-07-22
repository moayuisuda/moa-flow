/// <reference types="react" />
import Model from "./Model";
import { BehaviorName, StageEventName, WindowEventName } from "./typings/common";
declare type StageEventType = React.WheelEvent | React.MouseEvent;
interface StageEventFn {
    (e: StageEventType, model: Model): any;
}
interface WindowEventFn {
    (e: KeyboardEvent, model: Model): any;
}
interface InitFn {
    (model: Model): any;
}
declare type EventMaps = Partial<{
    [key in StageEventName]: StageEventFn;
} | {
    [key in WindowEventName]: WindowEventFn;
} | {
    'init': InitFn;
}>;
export declare const behaviorsMap: Record<BehaviorName, EventMaps>;
export declare const initEvents: (behaviors: BehaviorName[], model: Model) => Record<StageEventName, import("react").MouseEventHandler<HTMLDivElement> | undefined>;
export {};
