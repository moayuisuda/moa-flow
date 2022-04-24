import { __decorate } from './node_modules/tslib/tslib.es6.js';
import { observable, action, makeObservable } from 'mobx';
import { remove, isRectsInterSect, findIndex, arrayMove } from './utils/util.js';
import { color } from './theme/style.js';
import './node_modules/lodash/lodash.js';
import { l as lodash } from './_virtual/lodash.js';
import v4 from './packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

class FlowModel {
    constructor(eventSender) {
        this.extraContext = {};
        this.setEventSender = (eventSender) => {
            this.eventBus.sender = eventSender;
        };
        this.setCellsDataMap = () => {
            this.canvasData.cells.forEach((cellData) => {
                this.setCellDataMap(cellData);
            });
        };
        this._width = 1000;
        this._height = 600;
        this.width = (width) => {
            if (lodash.exports.isUndefined(width))
                return this._width;
            else {
                this._width = width;
                return width;
            }
        };
        this.height = (height) => {
            if (lodash.exports.isUndefined(height))
                return this._height;
            else {
                this._height = height;
                return height;
            }
        };
        this.setSize = (width, height) => {
            this._width = width;
            this._height = height;
        };
        this.grid = 1;
        this.setGrid = (grid) => {
            this.grid = grid;
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
        this.setHotKey = (key, value) => {
            this.hotKey[key] = value;
        };
        this.linkEdge = "Edge";
        this.setLinkEdge = (name) => {
            this.linkEdge = name;
        };
        this.clearPortEdge = (edgeId) => {
            const edgeData = this.cellsDataMap.get(edgeId);
            const sourcePort = this.getCellData(edgeData.source);
            const targetPort = this.getCellData(edgeData.target);
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
        this.setMultiSelect = (select, onlySetPosition = false) => {
            const { buffer: { select: bufferSelect }, } = this;
            Object.assign(bufferSelect, select);
            const right = Math.max(bufferSelect.start.x, bufferSelect.end.x);
            const x = Math.min(bufferSelect.start.x, bufferSelect.end.x);
            const y = Math.min(bufferSelect.start.y, bufferSelect.end.y);
            const bottom = Math.max(bufferSelect.start.y, bufferSelect.end.y);
            if (onlySetPosition)
                return;
            const re = [];
            this.cellsMap.forEach((cell) => {
                var _a;
                if (((_a = cell.props.data) === null || _a === void 0 ? void 0 : _a.cellType) === "node") {
                    const instance = cell.wrapperRef.current;
                    const bounds = instance.getClientRect({
                        relativeTo: instance.getStage(instance),
                    });
                    // 判断矩形是否相交
                    if (isRectsInterSect({
                        x,
                        y,
                        width: right - x,
                        height: bottom - y,
                    }, bounds)) {
                        re.push(cell.props.data.id);
                    }
                }
            });
            this.setSelectedCells(re);
        };
        this.clearLinkBuffer = () => {
            this.buffer.link = {
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
        this.regist = (...args) => {
            args.forEach((component) => {
                this.componentsMap.set(component.name, component);
            });
        };
        // 消息传递
        this.eventBus = {
            sender: undefined,
            receiver: undefined,
        };
        // 选中的cell
        this.selectCells = [];
        this.setSelectedCells = (ids, ifReplace = true) => {
            // @TODO select感觉只能放在私有属性，否则每次更新要diff全部的节点
            if (ifReplace) {
                this.selectCells = ids;
            }
            else {
                this.selectCells = lodash.exports.union(this.selectCells, ids);
            }
        };
        // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
        this.canvasData = {
            scale: 1,
            x: 0,
            y: 0,
            cells: [],
        };
        this.clearSelect = () => {
            this.selectCells = [];
        };
        this.sendEvent = (data) => {
            var _a, _b;
            (_b = (_a = this.eventBus).sender) === null || _b === void 0 ? void 0 : _b.call(_a, data);
        };
        this.setStageScale = (scale) => {
            this.canvasData.scale = scale;
        };
        this.setStagePosition = (x, y) => {
            this.canvasData.x = x;
            this.canvasData.y = y;
        };
        this.setCanvasData = (canvasData) => {
            this.canvasData = canvasData;
            // @TODO
            // this.cellsDataMap = new Map();
            // this.cellsMap = new Map();
            this.setCellsDataMap();
        };
        this.setCellId = (data) => {
            data.id = v4();
        };
        this.setCellData = (id, data) => {
            const cellData = this.getCellData(id);
            this.sendEvent({
                type: "data:change",
            });
            lodash.exports.merge(cellData, data);
        };
        this.getEdges = (nodeId) => {
            const re = [];
            const nodeData = this.getCellData(nodeId);
            if (nodeData.ports)
                nodeData.ports.forEach((port) => {
                    if (port.edges) {
                        port.edges.forEach((edgeId) => {
                            re.push(edgeId);
                        });
                    }
                });
            return re;
        };
        // 获取某一个结点连接的其他节点
        this.getLinkNodes = (id) => {
            const re = [];
            const nodeData = this.getCellData(id);
            if (nodeData.ports)
                nodeData.ports.forEach((port) => {
                    if (port.edges) {
                        port.edges.forEach((edgeId) => {
                            const edgeData = this.getCellData(edgeId);
                            const sourcePort = this.getCellData(edgeData.source);
                            const targetPort = this.getCellData(edgeData.target);
                            re.push(...lodash.exports.without(lodash.exports.union([sourcePort.host], [targetPort.host]), id));
                        });
                    }
                });
            return re;
        };
        this.deleCell = (id) => {
            const matchCell = this.canvasData.cells.find((cell) => cell.id === id);
            if (!matchCell) {
                console.error("[flow-infra] can not find match Cell");
                return;
            }
            if (matchCell.cellType === "edge")
                this.clearPortEdge(matchCell.id);
            remove(this.canvasData.cells, matchCell);
            return matchCell.id;
        };
        this.snap = (vector) => {
            const grid = this.grid;
            return {
                x: Math.round(vector.x / grid) * grid,
                y: Math.round(vector.y / grid) * grid,
            };
        };
        // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
        // @action setAutoLayout = (layoutOption) => {};
        // 创建新的节点数据
        this.createCellData = (component, initOptions) => {
            const id = v4();
            const metaData = JSON.parse(JSON.stringify(this.componentsMap.get(component).getMetaData()));
            return Object.assign(metaData, Object.assign({ id }, initOptions));
        };
        this.addCell = (componentName, initOptions) => {
            const newCellData = this.createCellData(componentName, initOptions);
            if (newCellData.ports) {
                newCellData.ports.forEach((port) => {
                    port.host = newCellData.id;
                    port.cellType = "port";
                    if (!port.id)
                        port.id = v4();
                });
            }
            this.canvasData.cells.push(newCellData);
            this.setCellDataMap(this.canvasData.cells[this.canvasData.cells.length - 1]);
            // console.log(
            //   newCellData,
            //   this.canvasData.cells[this.canvasData.cells.length - 1]
            // ); // 两者不是一个对象，后者是proxy
            return newCellData.id;
        };
        this.setLinkingPosition = (e) => {
            const cursorPos = e.currentTarget.getRelativePointerPosition();
            this.buffer.link.target.x = cursorPos.x;
            this.buffer.link.target.y = cursorPos.y;
        };
        this.link = (source, target) => {
            const sourceCellData = this.getCellData(source);
            const targetCellData = this.getCellData(target);
            const edgeId = this.addCell(this.linkEdge, {
                source,
                target,
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
            this.sendEvent({
                type: "linked",
                data: {
                    source,
                    target,
                },
            });
            this.clearLinkBuffer();
        };
        this.scale = (scale) => {
            if (lodash.exports.isUndefined(scale))
                return this.canvasData.scale;
            else {
                this.setStageScale(scale);
                return scale;
            }
        };
        this.getCell = (id) => {
            return this.cellsMap.get(id);
        };
        this.getCellData = (id) => {
            return this.cellsDataMap.get(id);
        };
        this.getCellInstance = (id) => {
            return this.cellsMap.get(id);
        };
        this.getCellsData = () => {
            return this.canvasData.cells;
        };
        makeObservable(this);
        if (eventSender)
            this.eventBus.sender = eventSender;
    }
    setCellDataMap(cellData) {
        this.cellsDataMap.set(cellData.id, cellData);
        function isNodeDataType(t) {
            return t.cellType === "node";
        }
        if (isNodeDataType(cellData)) {
            if (cellData.ports) {
                cellData.ports.forEach((portData) => {
                    this.setCellDataMap(portData);
                });
            }
        }
    }
    // @action
    x(x) {
        if (lodash.exports.isUndefined(x))
            return this.canvasData.x;
        else {
            this.setStagePosition(x, this.canvasData.y);
            return x;
        }
    }
    // @action
    y(y) {
        if (lodash.exports.isUndefined(y))
            return this.canvasData.y;
        else {
            this.setStagePosition(this.canvasData.x, y);
            return y;
        }
    }
    moveTo(id, index) {
        const oldIndex = findIndex(this.canvasData.cells, this.getCellData(id));
        arrayMove(this.canvasData.cells, oldIndex, index);
    }
}
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

export { FlowModel, FlowModel as default };
