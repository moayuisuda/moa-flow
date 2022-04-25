import { autorun } from 'mobx';
import './node_modules/lodash/lodash.js';
import { EVT_LEFTCLICK, STAGE_CLASS_NAME, EVT_RIGHTCLICK } from './constants.js';
import { l as lodash } from './_virtual/lodash.js';

const initClearState = (model, stage) => {
    stage.on('mousedown', (e) => {
        if (e.evt.button === EVT_LEFTCLICK) {
            model.buffer.rightClickPanel.visible = false;
        }
        if (!model.buffer.select.isSelecting && e.evt.button === EVT_LEFTCLICK)
            model.clearSelect();
    });
};
const initLink = (model, stage) => {
    stage.on('mouseup', () => {
        model.clearLinkBuffer();
    });
    stage.on('mousemove', e => {
        const { buffer: { link }, } = model;
        if (!link.source)
            return;
        model.setLinkingPosition(e);
    });
};
const initDrag = (model, stage, layers) => {
    const { linesLayer, nodesLayer, topLayer } = layers;
    // 移动选择的节点
    // 暂存节点原本的zIndex，方便还原到原本的layer
    let zIndexCache = {};
    const { drag, select } = model.buffer;
    // 移动整个stage
    stage.on('mousemove', e => {
        const movement = {
            x: (e.evt.x - drag.start.x),
            y: (e.evt.y - drag.start.y)
        };
        if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
            // stage并不受scale的影响，不用处理
            model.setStagePosition(model.x() + movement.x, model.y() + movement.y);
        }
        if (select.isSelecting) {
            if (stage.isListening())
                stage.listening(false);
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id);
                const konvaNode = model.getCellInstance(id).wrapperRef.current;
                if (cellData.cellType === 'node') {
                    if (!drag.movedToTop) {
                        zIndexCache[cellData.id] = konvaNode.zIndex();
                        konvaNode.moveTo(topLayer);
                    }
                    model.setCellData(cellData.id, {
                        x: cellData.x + movement.x / stage.scaleX(),
                        y: cellData.y + movement.y / stage.scaleY(),
                    });
                }
            });
            drag.movedToTop = true;
        }
        drag.start.x = e.evt.x;
        drag.start.y = e.evt.y;
    });
    // 空格键的时候触发缓存
    const stageDom = document.querySelector(`.${STAGE_CLASS_NAME}`);
    autorun(() => {
        if (!model.buffer.isWheeling) {
            // @TODO requestIdleCallbak 分片缓存
            if (model.hotKey["Space"] && !nodesLayer.isCached()) {
                stageDom.style.cursor = 'pointer';
                linesLayer.cache();
                nodesLayer.cache();
                /* 对于stage完全不需要调用`getIntersection`检测交互碰撞，因为它就是根组件不需要检测交互碰撞，逻辑上也是
                这样的，禁用了listening也能触发事件，实际应该就是禁用了hitGraph */
                stage.listening(false);
            }
            else {
                stageDom.style.cursor = '';
                linesLayer.clearCache();
                nodesLayer.clearCache();
                // listening语义上更倾向于之前的api`hitGraphEnabled`，但stage并不需要hitGraph
                stage.listening(true);
            }
        }
    });
    stage.on('mouseup', () => {
        if (select.isSelecting) {
            stage.listening(true);
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id);
                const konvaNode = model.getCellInstance(id).wrapperRef.current;
                if (cellData.cellType === 'node') {
                    konvaNode.moveTo(nodesLayer);
                    konvaNode.zIndex(zIndexCache[cellData.id]);
                    if (model.grid)
                        model.setCellData(cellData.id, model.snap({
                            x: cellData.x,
                            y: cellData.y
                        }));
                }
            });
            drag.movedToTop = false;
            select.isSelecting = false;
        }
    });
};
const initScale = (model, stage, layers) => {
    let scaleBy = 1.02;
    const { linesLayer, nodesLayer } = layers;
    const debounceClearCache = lodash.exports.debounce(() => {
        linesLayer.clearCache();
        nodesLayer.clearCache();
        linesLayer.listening(true);
        nodesLayer.listening(true);
        model.buffer.isWheeling = false;
    }, 300);
    stage.on('wheel', (e) => {
        if (!nodesLayer.isCached()) {
            model.buffer.isWheeling = true;
            linesLayer.cache();
            nodesLayer.cache();
            linesLayer.listening(false);
            nodesLayer.listening(false);
        }
        // stop default scrolling
        e.evt.preventDefault();
        const oldScale = model.canvasData.scale;
        const pointer = stage.getPointerPosition();
        var mousePointTo = {
            x: (pointer.x - model.x()) / oldScale,
            y: (pointer.y - model.y()) / oldScale,
        };
        console.log(pointer, model.x());
        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;
        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        model.setStageScale(newScale);
        ({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
        // model.setStagePosition(newPos.x, newPos.y);
        debounceClearCache();
    });
};
const initMultiSelect = (model, stage, layers) => {
    // // 非受控设置select的节点
    // let prevSelectCells = []
    // autorun(() => {
    //     // 上次存在这次不存在的就是需要设置为false的
    //     const toFalseCells = without(prevSelectCells, ...model.selectCells)
    //     // 这次存在上次不存在的就是需要设置为true的
    //     const toTrueCells = without(model.selectCells, ...prevSelectCells)
    //     toFalseCells.forEach(cellId => {
    //         const instance = model.getCellInstance(cellId)
    //         instance.flowState.isSelect = false
    //         instance.forceUpdate()
    //     })
    //     toTrueCells.forEach(cellId => {
    //         const instance = model.getCellInstance(cellId)
    //         instance.flowState.isSelect = true
    //         instance.forceUpdate()
    //     })
    //     prevSelectCells = model.selectCells.slice();
    // })
    if (model.hotKey['Space'])
        return;
    // 设置多选矩形框起始点
    stage.on('mousedown', (e) => {
        if (model.buffer.select.isSelecting)
            return;
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
    });
    // 矩形多选框 鼠标up时
    stage.on('mouseup', () => {
        if (model.buffer.select.isSelecting)
            return;
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
    });
    // 动态设置多选矩形框大小
    stage.on('mousemove', () => {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
            const pos = stage.getRelativePointerPosition();
            model.setMultiSelect({
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            });
        }
    });
};
const initHotKeys = (model, stage) => {
    stage.on('mousedown', e => {
        e.evt.preventDefault();
        switch (e.evt.button) {
            case EVT_LEFTCLICK:
                model.setHotKey('LeftMouseDown', true);
                break;
            case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true);
        }
    });
    stage.on('mouseup', e => {
        switch (e.evt.button) {
            case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false);
        }
    });
    window.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                model.setHotKey(e.code, true);
        }
    });
    window.addEventListener('keyup', e => {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                model.setHotKey(e.code, false);
        }
    });
};

export { initClearState, initDrag, initHotKeys, initLink, initMultiSelect, initScale };
