import { __spreadArray } from './node_modules/tslib/tslib.es6.js';
import { autorun } from 'mobx';
import './node_modules/lodash/lodash.js';
import { EVT_LEFTCLICK, EVT_RIGHTCLICK } from './constants.js';
import { l as lodash } from './_virtual/lodash.js';

var initClearState = function (model, stage) {
    stage.on('mousedown', function (e) {
        if (e.button === EVT_LEFTCLICK) {
            model.buffer.rightClickPanel.visible = false;
        }
        if (!model.buffer.select.isSelecting && e.button === EVT_LEFTCLICK)
            model.clearSelect();
    });
};
var initLink = function (model, stage) {
    stage.on('mouseup', function (e) {
        model.clearLinkBuffer();
    });
    stage.on('mousemove', function (e) {
        var link = model.buffer.link;
        if (!link.source)
            return;
        model.setLinkingPosition(e);
    });
};
var initSelect = function (model) {
    // 非受控设置select的节点
    var prevSelectCells = [];
    autorun(function () {
        // 上次存在这次不存在的就是需要设置为false的
        var toFalseCells = lodash.exports.without.apply(void 0, __spreadArray([prevSelectCells], model.selectCells, false));
        // 这次存在上次不存在的就是需要设置为true的
        var toTrueCells = lodash.exports.without.apply(void 0, __spreadArray([model.selectCells], prevSelectCells, false));
        toFalseCells.forEach(function (cellId) {
            var cellData = model.getCellData(cellId);
            cellData && (cellData.$state.isSelect = false);
        });
        toTrueCells.forEach(function (cellId) {
            var cellData = model.getCellData(cellId);
            cellData && (cellData.$state.isSelect = true);
        });
        prevSelectCells = model.selectCells.slice();
    });
};
var initDrag = function (model, stage) {
    var _a = model.buffer, drag = _a.drag, select = _a.select;
    // 移动整个stage
    stage.on('mousemove', function (e) {
        var movement = {
            x: (e.canvas.x - drag.start.x),
            y: (e.canvas.y - drag.start.y)
        };
        if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
            // stage并不受scale的影响，不用处理
            model.setStagePosition(model.x() + movement.x, model.y() + movement.y);
        }
        if (select.isSelecting) {
            // if (stage.isListening()) stage.listening(false);
            model.selectCells.forEach(function (id) {
                var cellData = model.getCellData(id);
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
    stage.on('mouseup', function () {
        if (select.isSelecting) {
            model.selectCells.forEach(function (id) {
                var cellData = model.getCellData(id);
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
var initScale = function (model, stage) {
    var scaleBy = 1.02;
    stage.on('wheel', function (e) {
        // stop default scrolling
        e.preventDefault();
        e.stopPropagation();
        var oldScale = model.canvasData.scale;
        var pointer = e.canvas;
        var mousePointTo = {
            x: (pointer.x - model.x()) / oldScale,
            y: (pointer.y - model.y()) / oldScale,
        };
        // how to scale? Zoom in? Or zoom out?
        var direction = e.deltaY > 0 ? 1 : -1;
        // in that case lets revert direction
        if (e.ctrlKey) {
            direction = -direction;
        }
        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        model.setStageScale(newScale);
        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        model.setStagePosition(newPos.x, newPos.y);
    });
};
var initMultiSelect = function (model, stage) {
    if (model.hotKey['Space'])
        return;
    // 设置多选矩形框起始点
    stage.on('mousedown', function (e) {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && e.button === EVT_LEFTCLICK) {
            var pos = model.getStageCursor(e);
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
    stage.on('mouseup', function (e) {
        if (model.buffer.select.isSelecting)
            return;
        var pos = model.getStageCursor(e);
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
    stage.on('mousemove', function (e) {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
            var pos = model.getStageCursor(e);
            model.setMultiSelect({
                end: {
                    x: pos.x,
                    y: pos.y,
                },
            });
        }
    });
};
var initHotKeys = function (model, stage) {
    stage.on('mousedown', function (e) {
        e.preventDefault();
        switch (e.button) {
            case EVT_LEFTCLICK:
                model.setHotKey('LeftMouseDown', true);
                break;
            case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true);
        }
    });
    stage.on('mouseup', function (e) {
        switch (e.button) {
            case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false);
        }
    });
    window.addEventListener('keydown', function (e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                model.setHotKey(e.code, true);
        }
    });
    window.addEventListener('keyup', function (e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                model.setHotKey(e.code, false);
        }
    });
};

export { initClearState, initDrag, initHotKeys, initLink, initMultiSelect, initScale, initSelect };
