import { __decorate, __assign } from './node_modules/tslib/tslib.es6.js';
import { observable, action, makeObservable } from 'mobx';
import { remove, isRectsInterSect, findIndex, arrayMove } from './utils/util.js';
import { color } from './theme/style.js';
import './node_modules/lodash/lodash.js';
import { l as lodash } from './_virtual/lodash.js';
import v4 from './packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

var FlowModel = /** @class */ (function () {
    function FlowModel(eventSender) {
        var _this = this;
        this.extraContext = {};
        this.setEventSender = function (eventSender) {
            _this.eventBus.sender = eventSender;
        };
        this.setCellsDataMap = function () {
            _this.canvasData.cells.forEach(function (cellData) {
                _this.setCellDataMap(cellData);
            });
        };
        this._width = 1000;
        this._height = 600;
        this.width = function (width) {
            if (lodash.exports.isUndefined(width))
                return _this._width;
            else {
                _this._width = width;
                return width;
            }
        };
        this.height = function (height) {
            if (lodash.exports.isUndefined(height))
                return _this._height;
            else {
                _this._height = height;
                return height;
            }
        };
        this.setSize = function (width, height) {
            _this._width = width;
            _this._height = height;
        };
        this.grid = 1;
        this.setGrid = function (grid) {
            _this.grid = grid;
        };
        this.refs = {
            stageRef: undefined,
            nodesLayerRef: undefined,
            linesLayerRef: undefined,
        };
        this.hotKey = {
            RightMouseDown: false,
            LeftMouseDown: false,
            Space: false,
        };
        this.setHotKey = function (key, value) {
            _this.hotKey[key] = value;
        };
        this.linkEdge = "Edge";
        this.setLinkEdge = function (name) {
            _this.linkEdge = name;
        };
        this.clearPortEdge = function (edgeId) {
            var edgeData = _this.getCellData(edgeId);
            var sourcePort = _this.getCellData(edgeData.source);
            var targetPort = _this.getCellData(edgeData.target);
            sourcePort.edges && remove(sourcePort.edges, edgeId);
            targetPort.edges && remove(targetPort.edges, edgeId);
        };
        // 一些中间状态，比如连线中的开始节点的暂存，不应该让外部
        this.buffer = {
            rightClickPanel: {
                visible: false,
            },
            drag: {
                movement: {
                    x: 0,
                    y: 0,
                },
                start: {
                    x: 0,
                    y: 0,
                },
            },
            isWheeling: false,
            select: {
                isSelecting: false,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
            },
            link: {
                // 只是为了统一渲染，加$state
                $state: {
                    isSelect: false,
                    isLinking: true,
                },
                edge: undefined,
                source: undefined,
                target: {
                    x: 0,
                    y: 0,
                },
            },
        };
        this.setMultiSelect = function (select, onlySetPosition) {
            if (onlySetPosition === void 0) { onlySetPosition = false; }
            var bufferSelect = _this.buffer.select;
            Object.assign(bufferSelect, select);
            var right = Math.max(bufferSelect.start.x, bufferSelect.end.x);
            var x = Math.min(bufferSelect.start.x, bufferSelect.end.x);
            var y = Math.min(bufferSelect.start.y, bufferSelect.end.y);
            var bottom = Math.max(bufferSelect.start.y, bufferSelect.end.y);
            if (onlySetPosition)
                return;
            var re = [];
            _this.cellsMap.forEach(function (cell) {
                var _a;
                if (((_a = cell.props.data) === null || _a === void 0 ? void 0 : _a.cellType) === "node") {
                    // 判断矩形是否相交
                    if (isRectsInterSect({
                        x: x,
                        y: y,
                        width: right - x,
                        height: bottom - y,
                    }, _this.getLocalBBox(cell.props.data.id))) {
                        re.push(cell.props.data.id);
                    }
                }
            });
            _this.setSelectedCells(re);
        };
        this.clearLinkBuffer = function () {
            Object.assign(_this.buffer.link, {
                edge: undefined,
                source: undefined,
                target: {
                    x: 0,
                    y: 0,
                },
            });
        };
        // 全局颜色，可以由用户自定义
        this.color = color;
        // cell的<id, 实例>map，方便用id获取到组件实例
        this.cellsMap = new Map();
        // cellData的<id, cellData>map，用来修改受控数据
        this.cellsDataMap = new Map();
        // 注册节点到model，方便动态引用
        this.componentsMap = new Map();
        this.regist = function (name, component) {
            _this.componentsMap.set(name, component);
        };
        // 消息传递
        this.eventBus = {
            sender: undefined,
            receiver: undefined,
        };
        // 选中的cell
        this.selectCells = [];
        this.setSelectedCells = function (ids, ifReplace) {
            if (ifReplace === void 0) { ifReplace = true; }
            // @TODO select感觉只能放在私有属性，否则每次更新要diff全部的节点
            if (ifReplace) {
                _this.selectCells = ids;
            }
            else {
                _this.selectCells = lodash.exports.union(_this.selectCells, ids);
            }
        };
        // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
        this.canvasData = {
            scale: 1,
            x: 0,
            y: 0,
            cells: [],
        };
        this.clearSelect = function () {
            _this.selectCells = [];
        };
        this.sendEvent = function (data) {
            var _a, _b;
            (_b = (_a = _this.eventBus).sender) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        };
        this.setStageScale = function (scale) {
            _this.canvasData.scale = scale;
        };
        this.setStagePosition = function (x, y) {
            _this.canvasData.x = x;
            _this.canvasData.y = y;
        };
        this.insertRuntimeState = function (cellData) {
            cellData.$state = {
                isSelect: false,
                isLinking: false,
            };
        };
        this.getLocalBBox = function (id) {
            var instanceBounds = _this.cellsMap
                .get(id)
                .wrapperRef.current.getLocalBounds();
            return {
                x: instanceBounds.center[0] - instanceBounds.halfExtents[0],
                y: instanceBounds.center[1] - instanceBounds.halfExtents[1],
                width: instanceBounds.halfExtents[0] * 2,
                height: instanceBounds.halfExtents[1] * 2,
            };
        };
        this.setCanvasData = function (canvasData) {
            canvasData.cells.forEach(function (cellData) {
                _this.insertRuntimeState(cellData);
            });
            _this.canvasData = canvasData;
            // 这里考虑到react会复用实例，所以不能简单地清除cellsMap
            // this.cellsDataMap.clear();
            // this.cellsMap.clear();
            _this.setCellsDataMap();
        };
        this.setCellId = function (data) {
            data.id = v4();
        };
        this.setCellData = function (id, data) {
            var cellData = _this.getCellData(id);
            _this.sendEvent({
                type: "data:change",
            });
            lodash.exports.merge(cellData, data);
        };
        this.getNodeEdges = function (nodeId) {
            var re = [];
            var nodeData = _this.getCellData(nodeId);
            if (nodeData.ports)
                nodeData.ports.forEach(function (port) {
                    if (port.edges) {
                        port.edges.forEach(function (edgeId) {
                            re.push(edgeId);
                        });
                    }
                });
            return re;
        };
        // 获取某一个结点连接的其他节点
        this.getLinkNodes = function (id) {
            var re = [];
            var nodeData = _this.getCellData(id);
            if (nodeData.ports)
                nodeData.ports.forEach(function (port) {
                    if (port.edges) {
                        port.edges.forEach(function (edgeId) {
                            var edgeData = _this.getCellData(edgeId);
                            var sourcePort = _this.getCellData(edgeData.source);
                            var targetPort = _this.getCellData(edgeData.target);
                            re.push.apply(re, lodash.exports.without(lodash.exports.union([sourcePort.host], [targetPort.host]), id));
                        });
                    }
                });
            return re;
        };
        this.deleCell = function (id) {
            var matchCell = _this.getCellData(id);
            if (!matchCell) {
                console.error("[flow-infra] can not find match dele Cell");
                return;
            }
            if (matchCell.cellType === "edge")
                _this.clearPortEdge(matchCell.id);
            _this.selectCells.includes(id) && remove(_this.selectCells, id);
            remove(_this.canvasData.cells, matchCell);
            _this.cellsMap.delete(id);
            _this.cellsDataMap.delete(id);
            _this.sendEvent({
                type: "data:change",
            });
            return matchCell.id;
        };
        this.snap = function (vector) {
            var grid = _this.grid;
            return {
                x: Math.round(vector.x / grid) * grid,
                y: Math.round(vector.y / grid) * grid,
            };
        };
        // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
        // @action setAutoLayout = (layoutOption) => {};
        // 创建新的节点数据
        this.createCellData = function (component, initOptions) {
            var id = v4();
            var metaData = Object.assign(_this.componentsMap.get(component).getMetaData(), {
                component: component,
            });
            _this.insertRuntimeState(metaData);
            return Object.assign(metaData, __assign({ id: id }, initOptions));
        };
        this.addCell = function (componentName, initOptions) {
            var newCellData = _this.createCellData(componentName, initOptions);
            if (newCellData.ports) {
                newCellData.ports.forEach(function (port) {
                    port.host = newCellData.id;
                    port.cellType = "port";
                    if (!port.id)
                        port.id = v4();
                });
            }
            _this.canvasData.cells.push(newCellData);
            _this.setCellDataMap(_this.canvasData.cells[_this.canvasData.cells.length - 1]);
            // console.log(
            //   newCellData,
            //   this.canvasData.cells[this.canvasData.cells.length - 1]
            // ); // 两者不是一个对象，后者是proxy
            _this.sendEvent({
                type: "data:change",
            });
            return newCellData.id;
        };
        this.setLinkingPosition = function (e) {
            var cursorPos = _this.getStageCursor(e);
            _this.buffer.link.target.x = cursorPos.x;
            _this.buffer.link.target.y = cursorPos.y;
        };
        this.link = function (source, target) {
            var sourceCellData = _this.getCellData(source);
            var targetCellData = _this.getCellData(target);
            var edgeId = _this.addCell(_this.linkEdge, {
                source: source,
                target: target,
            });
            if (sourceCellData.edges) {
                sourceCellData.edges.push(edgeId);
            }
            else
                sourceCellData.edges = [edgeId];
            if (targetCellData.edges) {
                targetCellData.edges.push(edgeId);
            }
            else
                targetCellData.edges = [edgeId];
            _this.sendEvent({
                type: "link",
                data: {
                    source: source,
                    target: target,
                },
            });
            _this.clearLinkBuffer();
        };
        this.scale = function (scale) {
            if (lodash.exports.isUndefined(scale))
                return _this.canvasData.scale;
            else {
                _this.setStageScale(scale);
                return scale;
            }
        };
        this.getCell = function (id) {
            return _this.cellsMap.get(id);
        };
        this.getCellData = function (id) {
            return _this.cellsDataMap.get(id);
        };
        this.getCellInstance = function (id) {
            return _this.cellsMap.get(id);
        };
        this.getCellsData = function () {
            return _this.canvasData.cells;
        };
        this.getStageCursor = function (e) {
            return {
                x: (e.canvas.x - _this.x()) / _this.scale(),
                y: (e.canvas.y - _this.y()) / _this.scale(),
            };
        };
        makeObservable(this);
        if (eventSender)
            this.eventBus.sender = eventSender;
    }
    FlowModel.prototype.setCellDataMap = function (cellData) {
        var _this = this;
        this.cellsDataMap.set(cellData.id, cellData);
        function isNodeDataType(t) {
            return t.cellType === "node";
        }
        if (isNodeDataType(cellData)) {
            if (cellData.ports) {
                cellData.ports.forEach(function (portData) {
                    _this.setCellDataMap(portData);
                });
            }
        }
    };
    // @action
    FlowModel.prototype.x = function (x) {
        if (lodash.exports.isUndefined(x))
            return this.canvasData.x;
        else {
            this.setStagePosition(x, this.canvasData.y);
            return x;
        }
    };
    // @action
    FlowModel.prototype.y = function (y) {
        if (lodash.exports.isUndefined(y))
            return this.canvasData.y;
        else {
            this.setStagePosition(this.canvasData.x, y);
            return y;
        }
    };
    FlowModel.prototype.moveTo = function (id, index) {
        var oldIndex = findIndex(this.canvasData.cells, this.getCellData(id));
        arrayMove(this.canvasData.cells, oldIndex, index);
    };
    __decorate([
        observable
    ], FlowModel.prototype, "_width", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "_height", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setSize", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "grid", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setGrid", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "hotKey", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setHotKey", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setLinkEdge", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "clearPortEdge", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "buffer", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setMultiSelect", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "clearLinkBuffer", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "color", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "selectCells", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setSelectedCells", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "canvasData", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "clearSelect", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setStageScale", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setStagePosition", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setCanvasData", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setCellId", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setCellData", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "deleCell", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "createCellData", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "addCell", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setLinkingPosition", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "link", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "moveTo", null);
    return FlowModel;
}());

export { FlowModel, FlowModel as default };
