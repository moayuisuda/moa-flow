import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
export declare const initStage: (model: ModelType, stage: Konva.Stage) => void;
export declare const initDrag: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
}) => void;
export declare const initScale: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
}) => void;
export declare const initMultiSelect: (model: ModelType, stage: Konva.Stage) => void;
export declare const initLinkingLine: (model: ModelType, stage: Konva.Stage) => void;
export declare const initHotKeys: (model: any) => void;
