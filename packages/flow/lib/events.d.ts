import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
export declare const initClearState: (model: ModelType, stage: Konva.Stage) => void;
export declare const initLink: (model: ModelType, stage: Konva.Stage) => void;
export declare const initSelect: (model: ModelType) => void;
export declare const initDrag: (model: ModelType, stage: any, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
    topLayer: Konva.Layer;
}) => void;
export declare const initScale: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
}) => void;
export declare const initMultiSelect: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
    topLayer: Konva.Layer;
}) => void;
export declare const initHotKeys: (model: ModelType, stage: Konva.Stage) => void;
export declare const initDataChangeListener: (model: ModelType) => void;
