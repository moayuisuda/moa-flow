import { __spreadArray } from './node_modules/tslib/tslib.es6.js';
import { autorun } from 'mobx';
import './node_modules/lodash/lodash.js';
import { EVT_LEFTCLICK, EVT_RIGHTCLICK, WINDOW_EVENT_NAMES, STAGE_EVENT_NAMES } from './constants.js';
import { l as lodash } from './_virtual/lodash.js';

var INPUT_NODELIST = ['TEXTAREA', 'INPUT'];
var behaviorsMap = {
    clearState: {
        onMouseDown: function (e, model) {
            if (!model.buffer.select.isSelecting && e.button === EVT_LEFTCLICK)
                model.clearSelect();
        },
        onClick: function (e, model) {
            if (e.button === EVT_LEFTCLICK) {
                model.contextMenuVisible = false;
            }
        }
    },
    link: {
        onMouseUp: function (e, model) {
            model.clearLinkBuffer();
        },
        onMouseMove: function (e, model) {
            var link = model.buffer.link;
            if (!link.source)
                return;
            model.setLinkingPosition(model.getCursorCoord(e));
        }
    },
    select: {
        init: function (model) {
            // 非受控设置select的节点
            var prevSelectCells = [];
            autorun(function () {
                // 上次存在这次不存在的就是需要设置为false的
                var toFalseCells = lodash.exports.without.apply(void 0, __spreadArray([prevSelectCells], model.selectCells, false));
                // 这次存在上次不存在的就是需要设置为true的
                var toTrueCells = lodash.exports.without.apply(void 0, __spreadArray([model.selectCells], prevSelectCells, false));
                toFalseCells.forEach(function (cellId) {
                    var cellModel = model.getCellModel(cellId);
                    cellModel && (cellModel.isSelect = false);
                });
                toTrueCells.forEach(function (cellId) {
                    var cellModel = model.getCellModel(cellId);
                    cellModel && (cellModel.isSelect = true);
                });
                prevSelectCells = model.selectCells.slice();
            });
        }
    },
    drag: {
        onMouseMove: function (e, model) {
            var select = model.buffer.select;
            // 这里是 e.movementX 不是 movement.x，如果用movement.x，那每一次移动，上次的dragStart实际已经不适用于新的坐标系了，而e.movement就不会，只记录从鼠标开始到结束
            var movement = {
                x: e.movementX / model.scale,
                y: e.movementY / model.scale
            };
            // 移动整个stage
            if (model.hotKey["Space"] && model.hotKey['LeftMouseDown']) {
                model.setStagePosition(model.x + movement.x, model.y + movement.y);
            }
            if (select.isSelecting) {
                model.selectCells.forEach(function (id) {
                    var cellData = model.getCellData(id);
                    if (cellData.cellType === 'node') {
                        model.setCellData(cellData.id, {
                            x: cellData.x + movement.x,
                            y: cellData.y + movement.y,
                        });
                    }
                });
            }
        },
        onMouseUp: function (e, model) {
            var select = model.buffer.select;
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
        }
    },
    scale: {
        onWheel: function (e, model) {
            /**
             * 获取当前坐标 p0
             * 获取鼠标当前位置在scale后的坐标 p1
             * p1与p0的差
             */
            var scaleBy = 1.01;
            e.preventDefault();
            e.stopPropagation();
            var oldScale = model.scale;
            var oldPointer = model.getCursorCoord(e);
            // how to scale? Zoom in? Or zoom out?
            var direction = e.deltaY > 0 ? 1 : -1;
            // in that case lets revert direction
            if (e.ctrlKey) {
                direction = -direction;
            }
            var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            var scaleTo = direction > 0 ? scaleBy : (1 / scaleBy);
            model.setStageScale(newScale);
            var preCursorNowPointer = {
                x: (oldPointer.x + model.x) / scaleTo - model.x,
                y: (oldPointer.y + model.y) / scaleTo - model.y,
            };
            // 用原本的pointer的坐标减去之前鼠标相同位置的现在pointer画布坐标
            var moveBack = {
                x: oldPointer.x - preCursorNowPointer.x,
                y: oldPointer.y - preCursorNowPointer.y
            };
            model.setStagePosition(model.x - moveBack.x, model.y - moveBack.y);
        }
    },
    multiSelect: {
        onMouseDown: function (e, model) {
            // if (model.hotKey['Space']) return
            if (model.buffer.select.isSelecting)
                return;
            if (!model.hotKey["Space"] && e.button === EVT_LEFTCLICK) {
                var pos = model.getCursorCoord(e);
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
        },
        onMouseUp: function (e, model) {
            if (model.buffer.select.isSelecting)
                return;
            var pos = model.getCursorCoord(e);
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
        },
        onMouseMove: function (e, model) {
            if (model.buffer.select.isSelecting)
                return;
            if (!model.hotKey["Space"] && model.hotKey["LeftMouseDown"]) {
                var pos = model.getCursorCoord(e);
                model.setMultiSelect({
                    end: {
                        x: pos.x,
                        y: pos.y,
                    },
                });
            }
        }
    },
    hotkeys: {
        onMouseDown: function (e, model) {
            switch (e.button) {
                case EVT_LEFTCLICK:
                    model.setHotKey('LeftMouseDown', true);
                    break;
                case EVT_RIGHTCLICK: model.setHotKey('RightMouseDown', true);
            }
        },
        onMouseUp: function (e, model) {
            switch (e.button) {
                case EVT_LEFTCLICK: model.setHotKey('LeftMouseDown', false);
            }
        },
        onKeyDown: function (e, model) {
            switch (e.code) {
                case 'Space':
                    if (INPUT_NODELIST.includes(e.target.nodeName))
                        return;
                    e.preventDefault();
                    model.setHotKey(e.code, true);
            }
        },
        onKeyUp: function (e, model) {
            switch (e.code) {
                case 'Space':
                    if (INPUT_NODELIST.includes(e.target.nodeName))
                        return;
                    e.preventDefault();
                    model.setHotKey(e.code, false);
            }
        }
    },
};
var PASSIVE_EVENTS = ['onWheel'];
var initEvents = function (behaviors, model) {
    var events = {
        'onMouseMove': undefined, 'onMouseDown': undefined, 'onMouseUp': undefined, 'onClick': undefined, 'onWheel': undefined
    };
    if (!model.isInitEvents) {
        for (var behavior in behaviorsMap) {
            var initFn = void 0;
            if (initFn = behaviorsMap[behavior]['init']) {
                initFn(model);
            }
        }
        var _loop_1 = function (eventKey) {
            behaviors.forEach(function (behavior) {
                var cb = behaviorsMap[behavior][eventKey];
                if (cb) {
                    window.addEventListener(eventKey.toLocaleLowerCase().replace('on', ''), function (e) { return cb(e, model); });
                }
            });
        };
        for (var _i = 0, WINDOW_EVENT_NAMES_1 = WINDOW_EVENT_NAMES; _i < WINDOW_EVENT_NAMES_1.length; _i++) {
            var eventKey = WINDOW_EVENT_NAMES_1[_i];
            _loop_1(eventKey);
        }
    }
    var _loop_2 = function (eventKey) {
        if (PASSIVE_EVENTS.includes(eventKey)) {
            if (!model.isInitEvents) {
                behaviors.forEach(function (behavior) {
                    var cb = behaviorsMap[behavior][eventKey];
                    if (cb) {
                        Promise.resolve().then(function () {
                            var _a;
                            (_a = model.refs.stageRef) === null || _a === void 0 ? void 0 : _a.addEventListener(eventKey.replace('on', '').toLocaleLowerCase(), function (e) { return cb(e, model); });
                        });
                    }
                });
            }
        }
        else {
            events[eventKey] = function (e) {
                behaviors.forEach(function (behavior) {
                    var cb = behaviorsMap[behavior][eventKey];
                    if (cb)
                        cb(e, model);
                });
            };
        }
    };
    for (var _a = 0, STAGE_EVENT_NAMES_1 = STAGE_EVENT_NAMES; _a < STAGE_EVENT_NAMES_1.length; _a++) {
        var eventKey = STAGE_EVENT_NAMES_1[_a];
        _loop_2(eventKey);
    }
    model.isInitEvents = true;
    return events;
};

export { behaviorsMap, initEvents };
