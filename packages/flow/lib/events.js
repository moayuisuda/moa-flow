import { autorun } from 'mobx';
import './node_modules/lodash/lodash.js';
import { EVT_LEFTCLICK, EVT_RIGHTCLICK } from './constants.js';
import { l as lodash } from './_virtual/lodash.js';

const initClearState = (model, stage) => {
    stage.on('mousedown', (e) => {
        if (e.button === EVT_LEFTCLICK) {
            model.buffer.rightClickPanel.visible = false;
        }
        if (!model.buffer.select.isSelecting && e.button === EVT_LEFTCLICK)
            model.clearSelect();
    });
};
const initLink = (model, stage) => {
    stage.on('mouseup', (e) => {
        model.clearLinkBuffer();
    });
    stage.on('mousemove', (e) => {
        const { buffer: { link }, } = model;
        if (!link.source)
            return;
        model.setLinkingPosition(e);
    });
};
const initSelect = (model) => {
    // 非受控设置select的节点
    let prevSelectCells = [];
    autorun(() => {
        // 上次存在这次不存在的就是需要设置为false的
        const toFalseCells = lodash.exports.without(prevSelectCells, ...model.selectCells);
        // 这次存在上次不存在的就是需要设置为true的
        const toTrueCells = lodash.exports.without(model.selectCells, ...prevSelectCells);
        toFalseCells.forEach(cellId => {
            const cellData = model.getCellData(cellId);
            cellData && (cellData.$state.isSelect = false);
        });
        toTrueCells.forEach(cellId => {
            const cellData = model.getCellData(cellId);
            cellData && (cellData.$state.isSelect = true);
        });
        prevSelectCells = model.selectCells.slice();
    });
};
const initDrag = (model, stage, layers) => {
    const { drag, select } = model.buffer;
    // 移动整个stage
    stage.on('mousemove', (e) => {
        const movement = {
            x: (e.canvas.x - drag.start.x),
            y: (e.canvas.y - drag.start.y)
        };
        if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
            // stage并不受scale的影响，不用处理
            model.setStagePosition(model.x() + movement.x, model.y() + movement.y);
        }
        if (select.isSelecting) {
            // if (stage.isListening()) stage.listening(false);
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id);
                if (cellData.cellType === 'node') {
                    model.setCellData(cellData.id, {
                        x: cellData.x + movement.x / model.scale(),
                        y: cellData.y + movement.y / model.scale(),
                    });
                }
            });
        }
        drag.start.x = e.canvas.x;
        drag.start.y = e.canvas.y;
    });
    stage.on('mouseup', () => {
        if (select.isSelecting) {
            model.selectCells.forEach(id => {
                const cellData = model.getCellData(id);
                if (cellData.cellType === 'node') {
                    if (model.grid)
                        model.setCellData(cellData.id, model.snap({
                            x: cellData.x,
                            y: cellData.y
                        }));
                }
            });
            select.isSelecting = false;
        }
    });
};
const initScale = (model, stage) => {
    let scaleBy = 1.02;
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.preventDefault();
        const oldScale = model.canvasData.scale;
        const pointer = e.canvas;
        var mousePointTo = {
            x: (pointer.x - model.x()) / oldScale,
            y: (pointer.y - model.y()) / oldScale,
        };
        // how to scale? Zoom in? Or zoom out?
        let direction = e.deltaY > 0 ? 1 : -1;
        // in that case lets revert direction
        if (e.ctrlKey) {
            direction = -direction;
        }
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        model.setStageScale(newScale);
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        model.setStagePosition(newPos.x, newPos.y);
        // debounceClearCache()
    });
};
const initMultiSelect = (model, stage) => {
    if (model.hotKey['Space'])
        return;
    // 设置多选矩形框起始点
    stage.on('mousedown', (e) => {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && e.button === EVT_LEFTCLICK) {
            const pos = e.canvas;
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
    stage.on('mouseup', (e) => {
        if (model.buffer.select.isSelecting)
            return;
        const pos = e.canvas;
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
    stage.on('mousemove', (e) => {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
            const pos = e.canvas;
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
        e.preventDefault();
        switch (e.button) {
            case EVT_LEFTCLICK:
                model.setHotKey('LeftMouseDown', true);
                break;
            case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true);
        }
    });
    stage.on('mouseup', e => {
        switch (e.button) {
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

export { initClearState, initDrag, initHotKeys, initLink, initMultiSelect, initScale, initSelect };
