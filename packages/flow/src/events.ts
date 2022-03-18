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
    nodesLayer: Konva.Layer,
    topLayer: Konva.Layer
}
) => {
    const { linesLayer, nodesLayer } = layers

    autorun(() => {
        if (!model.buffer.isWheeling) {
            // @TODO requestIdleCallbak 分片缓存
            if (model.hotKey["Space"] && !nodesLayer.isCached()) {
                linesLayer.cache()
                nodesLayer.cache()
                // 对于stage完全不需要调用 getIntersection 检测交互碰撞，因为它就是根组件不需要检测交互碰撞，这里先手动设置监听为false，应该是konva的一个设计失误
                stage.listening(false)
            } else {
                linesLayer.clearCache()
                nodesLayer.clearCache()
                stage.listening(true)
            }
        }
    })

    stage.on('mousemove', e => {
        console.log(stage.isListening())
        if (model.hotKey["Space"] && model.hotKey['MouseDown']) {
            model.setStagePosition(
                e.currentTarget.attrs.x + e.evt.movementX,
                e.currentTarget.attrs.y + e.evt.movementY
            );
        }
    })

    stage.on('mousemove', e => {
        if (model.buffer.isDragging) {
            if (stage.isListening()) stage.listening(false);

            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id) as NodeType & CellType
                if (cellData.type === 'node') {
                    model.moveTo(
                        cellData.id,
                        model.canvasData.cells.length - 1
                    );

                    model.setCellData(cellData.id, {
                        x: cellData.x + e.evt.movementX / model.canvasData.scale.x,
                        y: cellData.y + e.evt.movementY / model.canvasData.scale.y,
                    });
                }
            })
        }
    })

    stage.on('mouseup', () => {
        if (model.buffer.isDragging) {
            stage.listening(true)
            model.buffer.isDragging = false
        }
    })
}


export const initScale = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer
}) => {
    let scaleBy = 1.03;
    const { linesLayer, nodesLayer } = layers

    const debounceClearCache = debounce(() => {
        linesLayer.clearCache()
        nodesLayer.clearCache()
        linesLayer.listening(true)
        nodesLayer.listening(true)

        model.buffer.isWheeling = false
    }, 300)

    stage.on('wheel', (e) => {
        if (!nodesLayer.isCached()) {
            model.buffer.isWheeling = true
            linesLayer.cache()
            nodesLayer.cache()
            linesLayer.listening(false)
            nodesLayer.listening(false)
        }


        // stop default scrolling
        e.evt.preventDefault();

        const oldScale = model.canvasData.scale.x;
        const pointer = stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - model.canvasData.x) / oldScale,
            y: (pointer.y - model.canvasData.y) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        model.setStageScale(newScale, newScale);

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        model.setStagePosition(newPos.x, newPos.y);

        debounceClearCache()
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
        e.preventDefault()
        if (e.code in hotKey) {
            model.setHotKey(e.code, true)
        } else {
            extendObservable(hotKey, {
                [e.code]: true
            })
        }
    })

    window.addEventListener('keyup', e => {
        e.preventDefault()
        if (e.code in hotKey) {
            model.setHotKey(e.code, false)
        } else {
            extendObservable(hotKey, {
                [e.code]: false
            })
        }
    })
}