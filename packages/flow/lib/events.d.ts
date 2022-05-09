import Konva from "konva";
import { ModelType } from ".";
import { Canvas } from '@antv/g';
export declare const initClearState: (model: ModelType, stage: Canvas) => void;
export declare const initLink: (model: ModelType, stage: Canvas) => void;
export declare const initSelect: (model: ModelType) => void;
export declare const initDrag: (model: ModelType, stage: Canvas, layers: {
    linesLayer: Konva.Layer;
    nodesLayer: Konva.Layer;
    topLayer: Konva.Layer;
}) => void;
export declare const initScale: (model: ModelType, stage: Canvas) => void;
export declare const initMultiSelect: (model: ModelType, stage: Canvas) => void;
export declare const initHotKeys: (model: ModelType, stage: Canvas) => void;
export declare const initDataChangeListener: (model: ModelType) => void;
