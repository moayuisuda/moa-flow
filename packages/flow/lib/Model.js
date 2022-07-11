import { __decorate, __assign } from './node_modules/tslib/tslib.es6.js';
import './node_modules/lodash/lodash.js';
import { action, observable, computed, makeObservable } from 'mobx';
import { color } from './theme/style.js';
import { findIndex, arrayMove, remove, isRectsInterSect } from './utils/util.js';
import { l as lodash } from './_virtual/lodash.js';
import v4 from './packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

var FlowModel = /** @class */ (function () {
    function FlowModel(eventSender) {
        var _this = this;
        this.eventMap = new Map();
        this.setEventSender = function (eventSender) {
            _this.eventBus.sender = eventSender;
        };
        this.setCellsDataMap = function () {
            _this.canvasData.cells.forEach(function (cellData) {
                _this.setCellDataMap(cellData);
            });
        };
        this.extra = {};
        this.pendingRender = true;
        this._width = 1000;
        this._height = 600;
        this._grid = 40;
        this._linkEdge = "Edge";
        this.refs = {
            stageRef: undefined,
        };
        this.hotKey = {
            RightMouseDown: false,
            LeftMouseDown: false,
            Space: false,
        };
        this.setHotKey = function (key, value) {
            _this.hotKey[key] = value;
        };
        this.getLinkingPort = function () {
            return _this.buffer.link.source;
        };
        this.clearPortEdge = function (edgeId) {
            var edgeData = _this.getCellData(edgeId);
            var sourcePort = _this.getCellData(edgeData.source);
            var targetPort = _this.getCellData(edgeData.target);
            sourcePort.edges && remove(sourcePort.edges, edgeId);
            targetPort.edges && remove(targetPort.edges, edgeId);
        };
        // 一些中间状态，比如连线中的开始节点的暂存，不应该让外部感知
        this.buffer = {
            contextMenu: {
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
            _this.canvasData.cells.forEach(function (cellData) {
                if (cellData.cellType === "node") {
                    if (isRectsInterSect({
                        x: x,
                        y: y,
                        width: right - x,
                        height: bottom - y,
                    }, _this.getLocalBBox(cellData.id))) {
                        re.push(cellData.id);
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
        this.getWrapperRef = function (id) {
            var ref = _this.wrapperRefsMap.get(id);
            if (ref)
                return ref;
            else
                _this.wrapperRefsMap.set(id, { current: null });
            return _this.wrapperRefsMap.get(id);
        };
        // function component的外层group ref的map
        this.wrapperRefsMap = new Map();
        // cell的<id, 实例>map，方便用id获取到组件实例
        this.cellsMap = new Map();
        // cellData的<id, cellData>map，用来修改受控数据
        this.cellsDataMap = new Map();
        // 注册节点到model，方便动态引用
        this.componentsMap = new Map();
        this.regist = function (name, component) {
            _this.componentsMap.set(name, component);
        };
        this.eventBus = {
            sender: undefined,
            receiver: undefined,
        };
        // 选中的cell
        this.selectCells = [];
        this.setSelectedCells = function (ids, ifReplace) {
            if (ifReplace === void 0) { ifReplace = true; }
            if (ifReplace) {
                _this.selectCells = ids;
            }
            else {
                _this.selectCells = lodash.exports.union(_this.selectCells, ids);
            }
        };
        this.clearSelect = function () {
            _this.selectCells = [];
        };
        this.canvasData = {
            scale: 1,
            x: 0,
            y: 0,
            cells: [],
        };
        this.emitEvent = function (data) {
            var _a, _b;
            (_b = (_a = _this.eventBus).sender) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        };
        this.setStageScale = function (scale) {
            _this.canvasData.scale = scale;
        };
        this.insertRuntimeState = function (cellData) {
            cellData.$state = {
                isSelect: false,
                isLinking: false,
            };
        };
        this.getLocalBBox = function (id) {
            var _a, _b, _c;
            var instanceBounds = ((_a = _this.cellsMap.get(id)) === null || _a === void 0 ? void 0 : _a.wrapperRef.current.getLocalBounds()) ||
                ((_c = (_b = _this.wrapperRefsMap.get(id)) === null || _b === void 0 ? void 0 : _b.current) === null || _c === void 0 ? void 0 : _c.getLocalBounds());
            var _d = _this.getNodePosition(id), x = _d.x, y = _d.y;
            return {
                x: instanceBounds.center[0] - instanceBounds.halfExtents[0] + x,
                y: instanceBounds.center[1] - instanceBounds.halfExtents[1] + y,
                width: instanceBounds.halfExtents[0] * 2,
                height: instanceBounds.halfExtents[1] * 2,
            };
        };
        this.setCanvasData = function (canvasData) {
            _this.pendRender();
            canvasData.cells.forEach(function (cellData) {
                _this.insertRuntimeState(cellData);
            });
            _this.canvasData = canvasData;
            // 这里考虑到react会复用实例，所以不能简单地清除cellsMap
            // this.cellsDataMap.clear();
            // this.cellsMap.clear();
            _this.setCellsDataMap();
            _this.trigRender();
        };
        this.setCellId = function (data) {
            data.id = v4();
        };
        this.setCellData = function (id, data, rec) {
            if (rec === void 0) { rec = true; }
            var cellData = _this.getCellData(id);
            _this.emitEvent({
                type: "data:change",
            });
            if (!rec)
                Object.assign(cellData, data);
            else
                lodash.exports.merge(cellData, data);
        };
        /**
         * @description 获取某个node连接的所有edge
         */
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
        /**
         * @description 获取某个port连接的所有port
         */
        this.getPortLinkPorts = function (portId) {
            var _a;
            var re = [];
            var portData = _this.getCellData(portId);
            (_a = portData.edges) === null || _a === void 0 ? void 0 : _a.forEach(function (edgeId) {
                var edgeData = _this.getCellData(edgeId);
                var sourcePort = _this.getCellData(edgeData.source);
                var targetPort = _this.getCellData(edgeData.target);
                re.push.apply(re, lodash.exports.without(lodash.exports.union([sourcePort.id], [targetPort.id]), portId));
            });
            return re;
        };
        /**
         * @description 获取某个port连接的所有node
         */
        this.getPortLinkNodes = function (portId) {
            var _a;
            var re = [];
            var portData = _this.getCellData(portId);
            (_a = portData.edges) === null || _a === void 0 ? void 0 : _a.forEach(function (edgeId) {
                var edgeData = _this.getCellData(edgeId);
                var sourcePort = _this.getCellData(edgeData.source);
                var targetPort = _this.getCellData(edgeData.target);
                re.push.apply(re, lodash.exports.without(lodash.exports.union([sourcePort.host], [targetPort.host]), portData.host));
            });
            return re;
        };
        /**
         * @description 获取某个node连接的所有port
         */
        this.getLinkPorts = function (nodeId) {
            var re = [];
            var nodeData = _this.getCellData(nodeId);
            if (nodeData.ports)
                nodeData.ports.forEach(function (portData) {
                    re.push.apply(re, _this.getPortLinkPorts(portData.id));
                });
            return re;
        };
        /**
         * @description 获取某个node连接的所有node
         */
        this.getLinkNodes = function (nodeId) {
            var re = [];
            var nodeData = _this.getCellData(nodeId);
            if (nodeData.ports)
                nodeData.ports.forEach(function (portData) {
                    re.push.apply(re, _this.getPortLinkNodes(portData.id));
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
            _this.emitEvent({
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
        this.createCellData = function (component, initOptions) {
            var id = v4();
            var metaData = Object.assign(_this.componentsMap.get(component).getMetaData(), {
                component: component,
            });
            _this.insertRuntimeState(metaData);
            return Object.assign(metaData, __assign({ id: id, visible: true }, initOptions));
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
            _this.emitEvent({
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
            _this.emitEvent({
                type: "link",
                data: {
                    source: source,
                    target: target,
                },
            });
            _this.clearLinkBuffer();
        };
        this.setStagePosition = function (x, y) {
            _this.canvasData.x = x;
            _this.canvasData.y = y;
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
        this.getNodePosition = function (id) {
            var re = { x: 0, y: 0 };
            var curr = _this.getCellData(id);
            while (curr) {
                re.x += curr.x;
                re.y += curr.y;
                curr = curr.parent
                    ? _this.getCellData(curr.parent)
                    : undefined;
            }
            return re;
        };
        this.sendEvent = function (cellId, params) {
            var events = _this.eventMap.get(cellId);
            console.log(events);
            events &&
                events.forEach(function (event) {
                    event(params);
                });
        };
        /**
         * @description 获取当前鼠标的[画布坐标]
         */
        this.getStageCursor = function (e) {
            return {
                x: (e.canvas.x - _this.x) / _this.scale,
                y: (e.canvas.y - _this.y) / _this.scale,
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
    FlowModel.prototype.trigRender = function () {
        this.pendingRender = false;
    };
    FlowModel.prototype.pendRender = function () {
        this.pendingRender = true;
    };
    Object.defineProperty(FlowModel.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (width) {
            this._width = width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (height) {
            this._height = height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "size", {
        get: function () {
            return {
                width: this.width,
                height: this.height,
            };
        },
        set: function (size) {
            this.height = size.height;
            this.width = size.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "grid", {
        get: function () {
            return this._grid;
        },
        set: function (grid) {
            this._grid = grid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "linkEdge", {
        get: function () {
            return this._linkEdge;
        },
        set: function (linkEdge) {
            this._linkEdge = linkEdge;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "scale", {
        get: function () {
            return this.canvasData.scale;
        },
        set: function (scale) {
            this.setStageScale(scale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "x", {
        get: function () {
            return this.canvasData.x;
        },
        set: function (x) {
            this.canvasData.x = x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "y", {
        get: function () {
            return this.canvasData.y;
        },
        set: function (y) {
            this.canvasData.y = y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlowModel.prototype, "contextMenuVisible", {
        get: function () {
            return this.buffer.contextMenu.visible;
        },
        set: function (visible) {
            this.buffer.contextMenu.visible = visible;
        },
        enumerable: false,
        configurable: true
    });
    FlowModel.prototype.moveTo = function (id, index) {
        var oldIndex = findIndex(this.canvasData.cells, this.getCellData(id));
        arrayMove(this.canvasData.cells, oldIndex, index);
    };
    __decorate([
        action
    ], FlowModel.prototype, "trigRender", null);
    __decorate([
        action
    ], FlowModel.prototype, "pendRender", null);
    __decorate([
        observable
    ], FlowModel.prototype, "_width", void 0);
    __decorate([
        computed
    ], FlowModel.prototype, "width", null);
    __decorate([
        observable
    ], FlowModel.prototype, "_height", void 0);
    __decorate([
        computed
    ], FlowModel.prototype, "height", null);
    __decorate([
        computed
    ], FlowModel.prototype, "size", null);
    __decorate([
        observable
    ], FlowModel.prototype, "_grid", void 0);
    __decorate([
        computed
    ], FlowModel.prototype, "grid", null);
    __decorate([
        computed
    ], FlowModel.prototype, "linkEdge", null);
    __decorate([
        computed
    ], FlowModel.prototype, "scale", null);
    __decorate([
        computed
    ], FlowModel.prototype, "x", null);
    __decorate([
        computed
    ], FlowModel.prototype, "y", null);
    __decorate([
        computed
    ], FlowModel.prototype, "contextMenuVisible", null);
    __decorate([
        observable
    ], FlowModel.prototype, "hotKey", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setHotKey", void 0);
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
        action
    ], FlowModel.prototype, "clearSelect", void 0);
    __decorate([
        observable
    ], FlowModel.prototype, "canvasData", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setStageScale", void 0);
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
    ], FlowModel.prototype, "addCell", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setLinkingPosition", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "link", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setStagePosition", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "moveTo", null);
    return FlowModel;
}());

export { FlowModel, FlowModel as default };
