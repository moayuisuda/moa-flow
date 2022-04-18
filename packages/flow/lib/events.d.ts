import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
export declare const initClearState: (model: ModelType, stage: Konva.Stage) => void;
export declare const initLink: (model: ModelType, stage: Konva.Stage) => void;
export declare const initDrag: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
    topLayer: Konva.Layer;
}) => void;
export declare const initScale: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
}) => void;
export declare const initSelect: (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
    topLayer: Konva.Layer;
}) => void;
export declare const initHotKeys: (model: ModelType, stage: Konva.Stage) => void;