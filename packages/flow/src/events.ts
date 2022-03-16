import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
import { extendObservable, autorun } from "mobx"
import { debounce } from 'lodash'
import { NodeType } from "./cells/Node";
import { CellType } from './cells/Cell';

export const initStage = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', e => {
        model.clearSelect();
        model.setHotKey('MouseDown', true)
    })

    stage.on('mouseup', e => {
        model.clearLinkBuffer();
        model.setHotKey('MouseDown', false)
    })
}

export const initDrag = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer
}
) => {
    const { linesLayer, nodesLayer } = layers

    autorun(() => {
        if (model.hotKey["Space"]) {
            linesLayer.cache()
            nodesLayer.cache()
        } else {
            model.setStagePosition(stage.x(), stage.y());
            linesLayer.clearCache()
            nodesLayer.clearCache()
        }
    })

    stage.on('mousemove', e => {
        if (model.buffer.isDragging) {
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id) as NodeType & CellType
                if (cellData.type === 'node') {
                    model.setCellData(cellData.id, {
                        x: cellData.x + e.evt.movementX,
                        y: cellData.y + e.evt.movementY,
                    });
                }
            })
        }
    })

    stage.on('mousemove', e => {
        if (model.hotKey['Space']) {
            stage.position({
                x: stage.x() + e.evt.movementX,
                y: stage.y() + e.evt.movementY
            })
            // @TODO move比draggable性能差，看下draggable的原理
        }
    })
}


export const initScale = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer
}) => {
    let scaleBy = 1.02;
    const { linesLayer, nodesLayer } = layers

    const debouncedSetStage = debounce((scale, x, y) => {
        model.setStageScale(scale, scale);
        model.setStagePosition(x, y);

        linesLayer.clearCache()
        nodesLayer.clearCache()
    }, 500)

    stage.on('wheel', (e) => {
        if (!linesLayer.isCached()) linesLayer.cache()
        if (!nodesLayer.isCached()) nodesLayer.cache()

        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);

        debouncedSetStage(newScale, newPos.x, newPos.y)
    });
}

export const initMultiSelect = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', () => {
        if (!model.hotKey["Space"]) {
            const pos = stage.getRelativePointerPosition();
            model.setMultiSelect({
                start: {
                    x: pos.x,
                    y: pos.y,
                },
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            });
        }
    })

    stage.on('mouseup', () => {
        if (model.buffer.select.single) return
        const pos = stage.getRelativePointerPosition();
        model.setMultiSelect({
            start: {
                x: pos.x,
                y: pos.y,
            },
            end: {
                x: pos.x,
                y: pos.y,
            },
        }, true);
    })

    stage.on('mousemove', () => {
        if (!model.hotKey["Space"] && model.hotKey["MouseDown"]) {
            const pos = stage.getRelativePointerPosition();
            model.setMultiSelect({
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            });
        }
    })
}

export const initLinkingLine = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousemove', e => {
        const {
            buffer: { link },
        } = model;

        if (!link.source) return;
        model.setLinkingPosition(e);
    })
}

export const initHotKeys = (model) => {
    const { hotKey } = model

    window.addEventListener('keydown', e => {
        if (e.code in hotKey) {
            model.setHotKey(e.code, true)
        } else {
            extendObservable(hotKey, {
                [e.code]: true
            })
        }
    })

    window.addEventListener('keyup', e => {
        if (e.code in hotKey) {
            model.setHotKey(e.code, false)
        } else {
            extendObservable(hotKey, {
                [e.code]: false
            })
        }
    })
}