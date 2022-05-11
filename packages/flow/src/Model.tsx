import { action, observable, makeObservable } from "mobx";
import React from "react";
import { arrayMove, findIndex, isRectsInterSect, remove } from "./utils/util";
import { CellDataType } from "./cells/Cell";
import { color } from "./theme/style";
import { v4 } from "uuid";
import { union, without, merge, isUndefined } from "lodash";
import { EdgeDataType } from "./cells/Edge";
import { PortDataType } from "./scaffold/Port";
import { NodeDataType } from "./cells/Node";
import G from "@antv/g";
import { CanvasDataType, AllCellDataType, Vector2d } from "./types/common";
import Cell from "./cells/Cell";
import { InteractivePointerEvent } from "@antv/g";

type EventSender = (data: any) => void;
export class FlowModel {
  extraContext = {};

  constructor(eventSender?: EventSender) {
    makeObservable(this);
    if (eventSender) this.eventBus.sender = eventSender;
  }
  setEventSender = (eventSender: EventSender) => {
    this.eventBus.sender = eventSender;
  };

  setCellsDataMap = () => {
    this.canvasData.cells.forEach((cellData) => {
      this.setCellDataMap(cellData);
    });
  };

  setCellDataMap(cellData: AllCellDataType) {
    this.cellsDataMap.set(cellData.id, cellData);

    function isNodeDataType(t: AllCellDataType): t is NodeDataType {
      return t.cellType === "node";
    }

    if (isNodeDataType(cellData)) {
      if (cellData.ports) {
        cellData.ports.forEach((portData: AllCellDataType) => {
          this.setCellDataMap(portData);
        });
      }
    }
  }

  @observable _width: number = 1000;
  @observable _height: number = 600;
  width = (width?: number) => {
    if (isUndefined(width)) return this._width;
    else {
      this._width = width;
      return width;
    }
  };
  height = (height?: number) => {
    if (isUndefined(height)) return this._height;
    else {
      this._height = height;
      return height;
    }
  };

  @action
  setSize = (width: number, height: number) => {
    this._width = width;
    this._height = height;
  };

  @observable grid: number | undefined = 1;
  @action
  setGrid = (grid: number) => {
    this.grid = grid;
  };

  refs = {
    stageRef: undefined as React.RefObject<G.Canvas> | undefined,
    nodesLayerRef: undefined as React.RefObject<G.Group> | undefined,
    linesLayerRef: undefined as React.RefObject<G.Group> | undefined,
  };

  @observable
  hotKey = {
    RightMouseDown: false,
    LeftMouseDown: false,
    Space: false,
  };
  @action setHotKey = (
    key: "RightMouseDown" | "LeftMouseDown" | "Space",
    value: boolean
  ) => {
    this.hotKey[key] = value;
  };

  linkEdge = "Edge";
  @action setLinkEdge = (name: string) => {
    this.linkEdge = name;
  };

  @action clearPortEdge = (edgeId: string) => {
    const edgeData = this.getCellData(edgeId) as EdgeDataType;
    const sourcePort = this.getCellData(
      edgeData.source as string
    ) as PortDataType;
    const targetPort = this.getCellData(
      edgeData.target as string
    ) as PortDataType;
    sourcePort.edges && remove(sourcePort.edges as string[], edgeId);
    targetPort.edges && remove(targetPort.edges as string[], edgeId);
  };

  // 一些中间状态，比如连线中的开始节点的暂存，不应该让外部
  @observable
  buffer = {
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
      isSelecting: false, // 鼠标按下还没有松开的状态
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    },
    link: {
      // 只是为了统一渲染，加$state
      $state: {
        isSelect: false,
        isLinking: true,
      },
      edge: undefined as undefined | string,
      source: undefined as undefined | string,
      target: {
        x: 0,
        y: 0,
      },
    },
  };

  @action setMultiSelect = (
    select: {
      isSelecting?: boolean;
      start?: Vector2d;
      end?: Vector2d;
    },
    onlySetPosition = false
  ) => {
    const {
      buffer: { select: bufferSelect },
    } = this;

    Object.assign(bufferSelect, select);

    const right = Math.max(bufferSelect.start.x, bufferSelect.end.x);
    const x = Math.min(bufferSelect.start.x, bufferSelect.end.x);
    const y = Math.min(bufferSelect.start.y, bufferSelect.end.y);
    const bottom = Math.max(bufferSelect.start.y, bufferSelect.end.y);

    if (onlySetPosition) return;

    const re: string[] = [];
    this.cellsMap.forEach((cell) => {
      if (cell.props.data?.cellType === "node") {
        // 判断矩形是否相交
        if (
          isRectsInterSect(
            {
              x,
              y,
              width: right - x,
              height: bottom - y,
            },
            this.getLocalBBox(cell.props.data.id)
          )
        ) {
          re.push(cell.props.data.id);
        }
      }
    });

    this.setSelectedCells(re);
  };

  @action clearLinkBuffer = () => {
    Object.assign(this.buffer.link, {
      edge: undefined,
      source: undefined,
      target: {
        x: 0,
        y: 0,
      },
    });
  };

  // 全局颜色，可以由用户自定义
  @observable color = color;

  // cell的<id, 实例>map，方便用id获取到组件实例
  cellsMap = new Map<string, React.Component<any, any> & any>();
  // cellData的<id, cellData>map，用来修改受控数据
  cellsDataMap = new Map<string, CellDataType>();

  // 注册节点到model，方便动态引用
  componentsMap = new Map();
  regist = (name: string, component: Cell) => {
    this.componentsMap.set(name, component);
  };

  // 消息传递
  eventBus = {
    sender: undefined as EventSender | undefined,
    receiver: undefined,
  };

  // 选中的cell
  @observable selectCells: string[] = [];
  @action setSelectedCells = (ids: string[], ifReplace = true) => {
    // @TODO select感觉只能放在私有属性，否则每次更新要diff全部的节点
    if (ifReplace) {
      this.selectCells = ids;
    } else {
      this.selectCells = union(this.selectCells, ids);
    }
  };

  // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
  @observable canvasData: CanvasDataType = {
    scale: 1,
    x: 0,
    y: 0,
    cells: [],
  };

  @action clearSelect = () => {
    this.selectCells = [];
  };

  sendEvent = (data: any) => {
    this.eventBus.sender?.(data);
  };

  @action setStageScale = (scale: number) => {
    this.canvasData.scale = scale;
  };

  @action setStagePosition = (x: number, y: number) => {
    this.canvasData.x = x;
    this.canvasData.y = y;
  };

  insertRuntimeState = (cellData: CellDataType) => {
    cellData.$state = {
      isSelect: false,
      isLinking: false,
    };
  };

  getLocalBBox = (id: string) => {
    const instanceBounds = this.cellsMap
      .get(id)
      .wrapperRef.current.getLocalBounds();

    return {
      x: instanceBounds.center[0] - instanceBounds.halfExtents[0],
      y: instanceBounds.center[1] - instanceBounds.halfExtents[1],
      width: instanceBounds.halfExtents[0] * 2,
      height: instanceBounds.halfExtents[1] * 2,
    };
  };

  @action setCanvasData = (canvasData: CanvasDataType) => {
    canvasData.cells.forEach((cellData) => {
      this.insertRuntimeState(cellData);
    });

    this.canvasData = canvasData;
    // 这里考虑到react会复用实例，所以不能简单地清除cellsMap
    // this.cellsDataMap.clear();
    // this.cellsMap.clear();
    this.setCellsDataMap();
  };

  @action setCellId = (data: CellDataType) => {
    data.id = v4();
  };

  @action setCellData = (id: string, data: any) => {
    const cellData = this.getCellData(id);
    this.sendEvent({
      type: "data:change",
    });

    merge(cellData, data);
  };

  getNodeEdges = (nodeId: string) => {
    const re: string[] = [];
    const nodeData = this.getCellData(nodeId) as NodeDataType;
    if (nodeData.ports)
      nodeData.ports.forEach((port: PortDataType) => {
        if (port.edges) {
          port.edges.forEach((edgeId) => {
            re.push(edgeId);
          });
        }
      });

    return re;
  };

  // 获取某一个结点连接的其他节点
  getLinkNodes = (id: string) => {
    const re: string[] = [];
    const nodeData = this.getCellData(id) as NodeDataType;
    if (nodeData.ports)
      nodeData.ports.forEach((port: PortDataType) => {
        if (port.edges) {
          port.edges.forEach((edgeId) => {
            const edgeData = this.getCellData(edgeId) as EdgeDataType;
            const sourcePort = this.getCellData(
              edgeData.source as string
            ) as PortDataType;
            const targetPort = this.getCellData(
              edgeData.target as string
            ) as PortDataType;

            re.push(
              ...without(
                union([sourcePort.host as string], [targetPort.host as string]),
                id
              )
            );
          });
        }
      });

    return re;
  };

  @action deleCell = (id: string) => {
    const matchCell = this.getCellData(id);
    if (!matchCell) {
      console.error("[flow-infra] can not find match dele Cell");
      return;
    }

    if (matchCell.cellType === "edge") this.clearPortEdge(matchCell.id);

    this.selectCells.includes(id) && remove(this.selectCells, id);
    remove(this.canvasData.cells, matchCell);
    this.cellsMap.delete(id);
    this.cellsDataMap.delete(id);

    this.sendEvent({
      type: "data:change",
    });

    return matchCell.id;
  };

  snap = (vector: Vector2d) => {
    const grid = this.grid as number;
    return {
      x: Math.round(vector.x / grid) * grid,
      y: Math.round(vector.y / grid) * grid,
    };
  };

  // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
  // @action setAutoLayout = (layoutOption) => {};

  // 创建新的节点数据
  @action createCellData = (component: string, initOptions?: any) => {
    const id = v4();

    const metaData = Object.assign(
      this.componentsMap.get(component).getMetaData(),
      {
        component,
      }
    );

    this.insertRuntimeState(metaData);

    return Object.assign(metaData, {
      id,
      ...initOptions,
    });
  };

  @action addCell = (componentName: string, initOptions: any) => {
    const newCellData = this.createCellData(componentName, initOptions);

    if (newCellData.ports) {
      newCellData.ports.forEach((port: PortDataType) => {
        port.host = newCellData.id;
        port.cellType = "port";
        if (!port.id) port.id = v4();
      });
    }

    this.canvasData.cells.push(newCellData);
    this.setCellDataMap(
      this.canvasData.cells[this.canvasData.cells.length - 1]
    );

    // console.log(
    //   newCellData,
    //   this.canvasData.cells[this.canvasData.cells.length - 1]
    // ); // 两者不是一个对象，后者是proxy

    this.sendEvent({
      type: "data:change",
    });

    return newCellData.id;
  };

  @action setLinkingPosition = (e: InteractivePointerEvent) => {
    const cursorPos = this.getStageCursor(e);

    this.buffer.link.target.x = cursorPos.x;
    this.buffer.link.target.y = cursorPos.y;
  };

  @action link = (source: string, target: string) => {
    const sourceCellData = this.getCellData(source) as PortDataType;
    const targetCellData = this.getCellData(target) as PortDataType;

    const edgeId = this.addCell(this.linkEdge, {
      source,
      target,
    });

    if (sourceCellData.edges) {
      sourceCellData.edges.push(edgeId);
    } else sourceCellData.edges = [edgeId];

    if (targetCellData.edges) {
      targetCellData.edges.push(edgeId);
    } else targetCellData.edges = [edgeId];

    this.sendEvent({
      type: "link",
      data: {
        source,
        target,
      },
    });
    this.clearLinkBuffer();
  };

  scale = (scale?: number) => {
    if (isUndefined(scale)) return this.canvasData.scale;
    else {
      this.setStageScale(scale);
      return scale;
    }
  };

  // @action
  x(x?: number) {
    if (isUndefined(x)) return this.canvasData.x;
    else {
      this.setStagePosition(x, this.canvasData.y);
      return x;
    }
  }

  // @action
  y(y?: number) {
    if (isUndefined(y)) return this.canvasData.y;
    else {
      this.setStagePosition(this.canvasData.x, y);
      return y;
    }
  }

  @action
  moveTo(id: string, index: number) {
    const oldIndex = findIndex(
      this.canvasData.cells,
      this.getCellData(id)
    ) as number;
    arrayMove(this.canvasData.cells, oldIndex, index);
  }

  getCell = (id: string) => {
    return this.cellsMap.get(id);
  };

  getCellData = (id: string) => {
    return this.cellsDataMap.get(id);
  };

  getCellInstance = (id: string) => {
    return this.cellsMap.get(id);
  };

  getCellsData = () => {
    return this.canvasData.cells;
  };

  getStageCursor = (e: InteractivePointerEvent) => {
    return {
      x: (e.canvas.x - this.x()) / this.scale(),
      y: (e.canvas.y - this.y()) / this.scale(),
    };
  };
}

export default FlowModel;
