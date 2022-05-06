import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { ModelType } from ".";
import { autorun } from "mobx"
import { debounce, without } from 'lodash';
import { NodeDataType } from "./cells/Node";
import { CellDataType } from './cells/Cell';
import { STAGE_CLASS_NAME, EVT_LEFTCLICK, EVT_RIGHTCLICK } from './constants';
import { Vector2d } from "konva/lib/types";

export const initClearState = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', (e) => {
        if (e.evt.button === EVT_LEFTCLICK) {
            model.buffer.rightClickPanel.visible = false
        }
        if (!model.buffer.select.isSelecting && e.evt.button === EVT_LEFTCLICK)
            model.clearSelect();
    })
}

export const initLink = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mouseup', () => {
        model.clearLinkBuffer();
    })

    stage.on('mousemove', e => {
        const {
            buffer: { link },
        } = model;

        if (!link.source) return;
        model.setLinkingPosition(e);
    })
}

export const initSelect = (model: ModelType) => {
    // 非受控设置select的节点
    let prevSelectCells: string[] = []
    autorun(() => {
        // 上次存在这次不存在的就是需要设置为false的
        const toFalseCells = without(prevSelectCells, ...model.selectCells)
        // 这次存在上次不存在的就是需要设置为true的
        const toTrueCells = without(model.selectCells, ...prevSelectCells)

        toFalseCells.forEach(cellId => {
            const cellData = model.getCellData(cellId) as CellDataType
            cellData && (cellData.$state.isSelect = false)
        })

        toTrueCells.forEach(cellId => {
            const cellData = model.getCellData(cellId) as CellDataType
            cellData && (cellData.$state.isSelect = true)
        })

        prevSelectCells = model.selectCells.slice();
    })
}

export const initDrag = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer,
    topLayer: Konva.Layer
}
) => {
    const { linesLayer, nodesLayer, topLayer } = layers

    // 移动选择的节点
    // 暂存节点原本的zIndex，方便还原到原本的layer
    let zIndexCache: {
        [id: string]: number
    } = {}
    const { drag, select } = model.buffer

    // 移动整个stage
    stage.on('mousemove', e => {
        const movement = {
            x: (e.evt.x - drag.start.x),
            y: (e.evt.y - drag.start.y)
        }

        if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
            // stage并不受scale的影响，不用处理
            model.setStagePosition(
                model.x() + movement.x,
                model.y() + movement.y
            );
        }

        if (select.isSelecting) {
            if (stage.isListening()) stage.listening(false);

            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id) as NodeDataType & CellDataType
                const konvaNode = model.getCellInstance(id).wrapperRef.current

                if (cellData.cellType === 'node') {
                    if (!drag.movedToTop) {
                        zIndexCache[cellData.id] = konvaNode.zIndex()
                        konvaNode.moveTo(topLayer)
                    }

                    model.setCellData(cellData.id, {
                        x: cellData.x + movement.x / stage.scaleX(),
                        y: cellData.y + movement.y / stage.scaleY(),
                    });
                }
            })

            drag.movedToTop = true
        }

        drag.start.x = e.evt.x
        drag.start.y = e.evt.y
    })

    // 空格键的时候触发缓存
    const stageDom = document.querySelector(`.${STAGE_CLASS_NAME}`) as HTMLDivElement
    autorun(() => {
        if (!model.buffer.isWheeling) {
            // @TODO requestIdleCallbak 分片缓存
            if (model.hotKey["Space"] && !nodesLayer.isCached()) {
                stageDom.style.cursor = 'pointer'
                linesLayer.cache()
                nodesLayer.cache()

                /* 对于stage完全不需要调用`getIntersection`检测交互碰撞，因为它就是根组件不需要检测交互碰撞，逻辑上也是
                这样的，禁用了listening也能触发事件，实际应该就是禁用了hitGraph */
                stage.listening(false)
            } else {
                stageDom.style.cursor = ''
                linesLayer.clearCache()
                nodesLayer.clearCache()
                // listening语义上更倾向于之前的api`hitGraphEnabled`，但stage并不需要hitGraph
                stage.listening(true)
            }
        }
    })

    stage.on('mouseup', () => {
        if (select.isSelecting) {
            stage.listening(true)
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id) as NodeDataType & CellDataType
                const konvaNode = model.getCellInstance(id).wrapperRef.current

                if (cellData.cellType === 'node') {
                    konvaNode.moveTo(nodesLayer)
                    konvaNode.zIndex(zIndexCache[cellData.id])

                    if (model.grid)
                        model.setCellData(cellData.id, model.snap({
                            x: cellData.x,
                            y: cellData.y
                        }));
                }
            })

            drag.movedToTop = false
            select.isSelecting = false
        }
    })
}

const MIN_CACHE_LENGTH = 50
export const initScale = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer
}) => {
    let scaleBy = 1.02;
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

        const oldScale = model.canvasData.scale;
        const pointer = stage.getPointerPosition() as Vector2d;

        var mousePointTo = {
            x: (pointer.x - model.x()) / oldScale,
            y: (pointer.y - model.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?

        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        model.setStageScale(newScale);

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        model.setStagePosition(newPos.x, newPos.y);

        debounceClearCache()
    });
}

export const initMultiSelect = (model: ModelType, stage: Konva.Stage, layers: {
    linesLayer: Konva.Layer,
    nodesLayer: Konva.Layer,
    topLayer: Konva.Layer
}) => {

    if (model.hotKey['Space']) return

    // 设置多选矩形框起始点
    stage.on('mousedown', (e) => {
        if (model.buffer.select.isSelecting) return
        if (!model.hotKey["Space"] && e.evt.button === EVT_LEFTCLICK) {
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

    // 矩形多选框 鼠标up时
    stage.on('mouseup', () => {
        if (model.buffer.select.isSelecting) return
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

    // 动态设置多选矩形框大小
    stage.on('mousemove', () => {
        if (model.buffer.select.isSelecting) return
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
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

export const initHotKeys = (model: ModelType, stage: Konva.Stage) => {
    stage.on('mousedown', e => {
        e.evt.preventDefault()

        switch (e.evt.button) {
            case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', true); break;
            case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true)
        }
    })

    stage.on('mouseup', e => {
        switch (e.evt.button) {
            case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false)
        }
    })

    window.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space':
                e.preventDefault()
                model.setHotKey(e.code, true)
        }
    })

    window.addEventListener('keyup', e => {
        switch (e.code) {
            case 'Space':
                e.preventDefault()
                model.setHotKey(e.code, false)
        }
    })
}

export const initDataChangeListener = (model: ModelType) => { }