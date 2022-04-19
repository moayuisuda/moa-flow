import { __decorate, __assign } from './node_modules/tslib/tslib.es6.js';
import { observable, action, makeObservable } from 'mobx';
import { isRectsInterSect, findIndex, arrayMove } from './utils/util.js';
import { color } from './theme/style.js';
import './node_modules/lodash/lodash.js';
import { l as lodash } from './_virtual/lodash.js';
import v4 from './packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

var FlowModel = /** @class */ (function () {
    function FlowModel(eventSender) {
        var _this = this;
        this.setEventSender = function (eventSender) {
            _this.eventBus.sender = eventSender;
        };
        this.setCellsDataMap = function () {
            _this.canvasData.cells.forEach(function (cellData) {
                _this.setCellDataMap(cellData);
            });
        };
        this.setCellDataMap = function (cellData) {
            _this.cellsDataMap.set(cellData.id, cellData);
            if (cellData.cellType === "node" && cellData.ports) {
                cellData.ports.forEach(function (portData) {
                    _this.setCellDataMap(portData);
                });
            }
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
                movedToTop: false,
            },
            isWheeling: false,
            select: {
                isSelecting: false,
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
            },
            link: {
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
                    var instance = cell.wrapperRef.current;
                    var bounds = instance.getClientRect({
                        relativeTo: instance.getStage(instance),
                    });
                    // 判断矩形是否相交
                    if (isRectsInterSect({
                        x: x,
                        y: y,
                        width: right - x,
                        height: bottom - y,
                    }, bounds)) {
                        re.push(cell.props.data.id);
                    }
                }
            });
            _this.setSelectedCells(re);
        };
        this.clearLinkBuffer = function () {
            _this.buffer.link = {
                edge: undefined,
                source: undefined,
                target: {
                    x: 0,
                    y: 0,
                },
            };
        };
        // 全局颜色，可以由用户自定义
        this.color = color;
        // cell的<id, 实例>map，方便用id获取到组件实例
        this.cellsMap = new Map();
        // cellData的<id, cellData>map，用来修改受控数据
        this.cellsDataMap = new Map();
        // 注册节点到model，方便动态引用
        this.componentsMap = new Map();
        this.regist = function (component) {
            _this.componentsMap.set(component.name, component);
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
            scale: { x: 1, y: 1 },
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
        this.setStageScale = function (x, y) {
            _this.canvasData.scale = {
                x: x,
                y: y,
            };
        };
        this.setStagePosition = function (x, y) {
            _this.canvasData.x = x;
            _this.canvasData.y = y;
        };
        this.setCanvasData = function (canvasData) {
            _this.canvasData = canvasData;
            _this.setCellsDataMap();
        };
        this.setCellId = function (data) {
            data.id = v4();
        };
        this.setCellData = function (id, data) {
            var cellData = _this.getCellData(id);
            lodash.exports.merge(cellData, data);
        };
        this.getEdges = function (id) {
            var re = [];
            var nodeData = _this.getCellData(id);
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
            var matchCell = _this.canvasData.cells.find(function (cell) { return cell.id === id; });
            _this.canvasData.cells.splice(findIndex(_this.canvasData.cells, matchCell), 1);
            return matchCell.id;
        };
        this.deleEdge = function (id) { };
        // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
        this.setAutoLayout = function (layoutOption) { };
        // 创建新的节点数据
        this.createCellData = function (component, initOptions) {
            var id = v4();
            var metaData = JSON.parse(JSON.stringify(_this.componentsMap.get(component).getMetaData()));
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
            return newCellData.id;
        };
        this.setLinkingPosition = function (e) {
            var cursorPos = e.currentTarget.getRelativePointerPosition();
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
                type: "linked",
                data: {
                    source: source,
                    target: target,
                },
            });
            _this.clearLinkBuffer();
        };
        this.getCellData = function (id) {
            return _this.cellsDataMap.get(id);
        };
        this.getCellInstance = function (id) {
            return _this.cellsMap.get(id);
        };
        makeObservable(this);
        if (eventSender)
            this.eventBus.sender = eventSender;
    }
    FlowModel.prototype.moveTo = function (id, index) {
        var oldIndex = findIndex(this.canvasData.cells, this.getCellData(id));
        arrayMove(this.canvasData.cells, oldIndex, index);
    };
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
    ], FlowModel.prototype, "deleEdge", void 0);
    __decorate([
        action
    ], FlowModel.prototype, "setAutoLayout", void 0);
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
var a = new FlowModel();
a.regist(Node);

export { FlowModel, FlowModel as default };
