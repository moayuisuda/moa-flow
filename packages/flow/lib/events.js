import { __spreadArray } from './node_modules/tslib/tslib.es6.js';
import { autorun } from 'mobx';
import './node_modules/lodash/lodash.js';
import { EVT_LEFTCLICK, STAGE_CLASS_NAME, EVT_RIGHTCLICK } from './constants.js';
import { l as lodash } from './_virtual/lodash.js';

var initClearState = function (model, stage) {
    stage.on('mousedown', function (e) {
        if (e.evt.button === EVT_LEFTCLICK) {
            model.buffer.rightClickPanel.visible = false;
        }
        if (!model.buffer.select.isSelecting && e.evt.button === EVT_LEFTCLICK)
            model.clearSelect();
    });
};
var initLink = function (model, stage) {
    stage.on('mouseup', function () {
        model.clearLinkBuffer();
    });
    stage.on('mousemove', function (e) {
        var link = model.buffer.link;
        if (!link.source)
            return;
        model.setLinkingPosition(e);
    });
};
var initDrag = function (model, stage, layers) {
    var linesLayer = layers.linesLayer, nodesLayer = layers.nodesLayer, topLayer = layers.topLayer;
    // 移动选择的节点
    // 暂存节点原本的zIndex，方便还原到原本的layer
    var zIndexCache = {};
    var _a = model.buffer, drag = _a.drag, select = _a.select;
    // 移动整个stage
    stage.on('mousemove', function (e) {
        var movement = {
            x: (e.evt.x - drag.start.x),
            y: (e.evt.y - drag.start.y)
        };
        if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
            // stage并不受scale的影响，不用处理
            model.setStagePosition(model.canvasData.x + movement.x, model.canvasData.y + movement.y);
        }
        if (select.isSelecting) {
            if (stage.isListening())
                stage.listening(false);
            model.selectCells.forEach(function (id) {
                var cellData = model.getCellData(id);
                var konvaNode = model.getCellInstance(id).wrapperRef.current;
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
    var stageDom = document.querySelector(".".concat(STAGE_CLASS_NAME));
    autorun(function () {
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
    stage.on('mouseup', function () {
        if (select.isSelecting) {
            stage.listening(true);
            model.selectCells.forEach(function (id) {
                var cellData = model.getCellData(id);
                var konvaNode = model.getCellInstance(id).wrapperRef.current;
                if (cellData.cellType === 'node') {
                    konvaNode.moveTo(nodesLayer);
                    konvaNode.zIndex(zIndexCache[cellData.id]);
                }
            });
            drag.movedToTop = false;
            select.isSelecting = false;
        }
    });
};
var initScale = function (model, stage, layers) {
    var scaleBy = 1.03;
    var linesLayer = layers.linesLayer, nodesLayer = layers.nodesLayer;
    var debounceClearCache = lodash.exports.debounce(function () {
        linesLayer.clearCache();
        nodesLayer.clearCache();
        linesLayer.listening(true);
        nodesLayer.listening(true);
        model.buffer.isWheeling = false;
    }, 300);
    stage.on('wheel', function (e) {
        if (!nodesLayer.isCached()) {
            model.buffer.isWheeling = true;
            linesLayer.cache();
            nodesLayer.cache();
            linesLayer.listening(false);
            nodesLayer.listening(false);
        }
        // stop default scrolling
        e.evt.preventDefault();
        var oldScale = model.canvasData.scale.x;
        var pointer = stage.getPointerPosition();
        var mousePointTo = {
            x: (pointer.x - model.canvasData.x) / oldScale,
            y: (pointer.y - model.canvasData.y) / oldScale,
        };
        // how to scale? Zoom in? Or zoom out?
        var direction = e.evt.deltaY > 0 ? 1 : -1;
        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }
        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        model.setStageScale(newScale, newScale);
        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        model.setStagePosition(newPos.x, newPos.y);
        debounceClearCache();
    });
};
var initSelect = function (model, stage, layers) {
    layers.linesLayer; layers.nodesLayer;
    // 非受控设置select的节点
    var prevSelectCells = [];
    autorun(function () {
        // 上次存在这次不存在的就是需要设置为false的
        var toFalseCells = lodash.exports.without.apply(void 0, __spreadArray([prevSelectCells], model.selectCells, false));
        // 这次存在上次不存在的就是需要设置为true的
        var toTrueCells = lodash.exports.without.apply(void 0, __spreadArray([model.selectCells], prevSelectCells, false));
        toFalseCells.forEach(function (cellId) {
            var instance = model.getCellInstance(cellId);
            instance.flowState.isSelect = false;
            instance.forceUpdate();
        });
        toTrueCells.forEach(function (cellId) {
            var instance = model.getCellInstance(cellId);
            instance.flowState.isSelect = true;
            instance.forceUpdate();
        });
        prevSelectCells = model.selectCells.slice();
    });
    // 设置多选矩形框起始点
    stage.on('mousedown', function (e) {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && e.evt.button === EVT_LEFTCLICK) {
            var pos = stage.getRelativePointerPosition();
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
    stage.on('mouseup', function () {
        if (model.buffer.select.isSelecting)
            return;
        var pos = stage.getRelativePointerPosition();
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
    stage.on('mousemove', function () {
        if (model.buffer.select.isSelecting)
            return;
        if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
            var pos = stage.getRelativePointerPosition();
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
        e.evt.preventDefault();
        switch (e.evt.button) {
            case EVT_LEFTCLICK:
                model.setHotKey('LeftMouseDown', true);
                break;
            case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true);
        }
    });
    stage.on('mouseup', function (e) {
        switch (e.evt.button) {
            case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false);
        }
    });
    window.addEventListener('keydown', function (e) {
        // e.preventDefault()
        model.setHotKey(e.code, true);
    });
    window.addEventListener('keyup', function (e) {
        // e.preventDefault()
        model.setHotKey(e.code, false);
    });
};

export { initClearState, initDrag, initHotKeys, initLink, initScale, initSelect };
