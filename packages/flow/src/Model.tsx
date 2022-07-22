import { merge, union, without } from "lodash";
import { action, makeObservable, observable, computed } from "mobx";
import React from "react";
import { v4 } from "uuid";
import { CellDataType, CellModel } from "./cells/Cell";
import { Edge, EdgeDataType, EdgeModel } from "./cells/Edge";
import { NodeModel, NodeDataType } from "./cells/Node";
import { Port, PortDataType } from "./components";
import { color } from "./theme/style";
import {
  AllCellDataType,
  CanvasDataType,
  Override,
  Vector2d,
} from "./typings/common";
import { arrayMove, findIndex, isRectsInterSect, remove } from "./utils/util";
import { getRelativeBoundingBox } from "./utils/coords";

type EventSender = (data: any) => void;
export class FlowModel {
  eventMap = new Map<string, Map<string, Function>>();

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

    if (!this.modelFactoriesMap.get(cellData.component)) {
      this.modelFactoriesMap.set(
        cellData.component,
        cellData.component || cellData.cellType === "node"
          ? NodeModel
          : EdgeModel
      );
    }

    if (isNodeDataType(cellData)) {
      if (cellData.ports) {
        cellData.ports.forEach((portData: AllCellDataType) => {
          this.setCellDataMap(portData);
        });
      }
    }
  }

  extra: any = {};

  pendingRender: boolean = true;
  @action
  trigRender() {
    this.pendingRender = false;
  }
  @action
  pendRender() {
    this.pendingRender = true;
  }

  @observable _width: number = 1000;
  @computed
  get width() {
    return this._width;
  }
  set width(width: number) {
    this._width = width as number;
  }

  @observable _height: number = 600;
  @computed
  get height() {
    return this._height;
  }
  set height(height: number) {
    this._height = height as number;
  }

  @computed
  get size() {
    return {
      width: this.width,
      height: this.height,
    };
  }
  set size(size: { width: number; height: number }) {
    this.height = size.height;
    this.width = size.width;
  }

  @observable _grid: number = 0;
  @computed
  get grid() {
    return this._grid;
  }
  set grid(grid: number) {
    this._grid = grid;
  }

  _linkEdge = "Edge";
  @computed
  get linkEdge() {
    return this._linkEdge;
  }
  set linkEdge(linkEdge: string) {
    this._linkEdge = linkEdge;
  }

  @computed
  get scale() {
    return this.canvasData.scale;
  }
  set scale(scale: number) {
    this.setStageScale(scale);
  }

  @computed
  get x() {
    return this.canvasData.x;
  }
  set x(x: number) {
    this.canvasData.x = x;
  }

  @computed
  get y() {
    return this.canvasData.y;
  }
  set y(y: number) {
    this.canvasData.y = y;
  }

  @computed
  get contextMenuVisible() {
    return this.buffer.contextMenu.visible;
  }
  set contextMenuVisible(visible: boolean) {
    this.buffer.contextMenu.visible = visible;
  }

  refs = {
    stageRef: null as HTMLDivElement | null,
    svgRef: null as SVGElement | null,
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

  getLinkingPort = () => {
    return this.buffer.link.source;
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

  // 一些中间状态，比如连线中的开始节点的暂存，不应该让外部感知
  @observable
  buffer = {
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
    this.canvasData.cells.forEach((cellData) => {
      if (cellData.cellType === "node") {
        if (
          isRectsInterSect(
            {
              x,
              y,
              width: right - x,
              height: bottom - y,
            },
            this.getLocalBBox(cellData.id)
          )
        ) {
          re.push(cellData.id);
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

  getWrapperRef = (id: string): React.RefObject<HTMLDivElement> => {
    const ref = this.wrapperRefsMap.get(id);

    if (ref) return ref;
    else this.wrapperRefsMap.set(id, { current: null });

    return this.wrapperRefsMap.get(id) as React.RefObject<HTMLDivElement>;
  };
  // function component的外层group ref的map
  wrapperRefsMap = new Map<string, { current: HTMLDivElement | null }>();
  // cell的<id, 实例>map，方便用id获取到组件实例
  cellsMap = new Map<string, React.Component<any, any> & any>();
  cellsModelMap = new Map<string, CellModel>();
  // cellData的<id, cellData>map，用来修改受控数据
  cellsDataMap = new Map<string, CellDataType>();

  // 注册节点到model，方便动态引用
  componentsMap = new Map<string, typeof Port | React.FC>([
    ["Edge", Edge],
    ["Port", Port],
  ]);
  // component和model的映射
  modelFactoriesMap = new Map<string, typeof CellModel>([["Edge", EdgeModel]]);

  regist = (name: string, component: any) => {
    this.componentsMap.set(name, component);
  };

  eventBus = {
    sender: undefined as EventSender | undefined,
    receiver: undefined,
  };

  // 选中的cell
  @observable selectCells: string[] = [];
  @action setSelectedCells = (ids: string[], ifReplace = true) => {
    if (ifReplace) {
      this.selectCells = ids;
    } else {
      this.selectCells = union(this.selectCells, ids);
    }
  };
  @action clearSelect = () => {
    this.selectCells = [];
  };

  @observable canvasData: CanvasDataType = {
    scale: 1,
    x: 0,
    y: 0,
    cells: [],
  };

  emitEvent = (data: any) => {
    this.eventBus.sender?.(data);
  };

  @action setStageScale = (scale: number) => {
    this.canvasData.scale = scale;
  };

  insertRuntimeState = (cellData: CellDataType) => {
    cellData.$state = {
      isSelect: false,
      isLinking: false,
    };
  };

  /**
   * @description 获取当前鼠标的[画布坐标]
   */

  // @TODO 在添加节点，拖拽线条时候并不需要svg的pointerEvents
  getCursorCoord = (e: React.MouseEvent) => {
    const stageBounds = this.refs.stageRef?.getBoundingClientRect() as DOMRect;

    return {
      x: (e.clientX - stageBounds.x - this.x) / this.scale,
      y: (e.clientY - stageBounds.y - this.y) / this.scale,
    };
  };

  getLocalBBox = (id: string) => {
    const dom = this.wrapperRefsMap.get(id)?.current as HTMLDivElement;

    return getRelativeBoundingBox(dom, this.refs.stageRef as HTMLDivElement);
  };

  @action setCanvasData = (canvasData: CanvasDataType) => {
    this.pendRender();

    canvasData.cells.forEach((cellData) => {
      this.insertRuntimeState(cellData);
    });

    this.canvasData = canvasData;
    // 这里考虑到react会复用实例，所以不能简单地清除cellsMap
    // this.cellsDataMap.clear();
    // this.cellsMap.clear();
    this.setCellsDataMap();

    this.trigRender();
  };

  @action setCellId = (data: CellDataType) => {
    data.id = v4();
  };

  @action setCellData = (id: string, data: any, rec: boolean = true) => {
    const cellData = this.getCellData(id);
    this.emitEvent({
      type: "data:change",
    });

    if (!rec) Object.assign(cellData, data);
    else merge(cellData, data);
  };

  /**
   * @description 获取某个node连接的所有edge
   */
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

  /**
   * @description 获取某个port连接的所有port
   */
  getPortLinkPorts = (portId: string) => {
    const re: string[] = [];

    const portData = this.getCellData(portId) as PortDataType;
    portData.edges?.forEach((edgeId) => {
      const edgeData = this.getCellData(edgeId) as EdgeDataType;
      const sourcePort = this.getCellData(
        edgeData.source as string
      ) as PortDataType;
      const targetPort = this.getCellData(
        edgeData.target as string
      ) as PortDataType;

      re.push(
        ...without(
          union([sourcePort.id as string], [targetPort.id as string]),
          portId
        )
      );
    });

    return re;
  };

  /**
   * @description 获取某个port连接的所有node
   */
  getPortLinkNodes = (portId: string) => {
    const re: string[] = [];

    const portData = this.getCellData(portId) as PortDataType;
    portData.edges?.forEach((edgeId) => {
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
          portData.host as string
        )
      );
    });

    return re;
  };

  /**
   * @description 获取某个node连接的所有port
   */
  getLinkPorts = (nodeId: string) => {
    const re: string[] = [];
    const nodeData = this.getCellData(nodeId) as NodeDataType;
    if (nodeData.ports)
      nodeData.ports.forEach((portData: PortDataType) => {
        re.push(...this.getPortLinkPorts(portData.id));
      });

    return re;
  };

  /**
   * @description 获取某个node连接的所有node
   */
  getLinkNodes = (nodeId: string) => {
    const re: string[] = [];
    const nodeData = this.getCellData(nodeId) as NodeDataType;
    if (nodeData.ports)
      nodeData.ports.forEach((portData: PortDataType) => {
        re.push(...this.getPortLinkNodes(portData.id));
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

    this.emitEvent({
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

  createCellData = (component: string, initOptions?: any) => {
    const id = v4();

    const metaData = Object.assign(
      (this.modelFactoriesMap.get(component) as typeof CellModel).defaultData,
      {
        component,
      }
    );

    console.log(metaData)

    this.insertRuntimeState(metaData);

    return Object.assign(metaData, {
      id,
      visible: true,
      ...initOptions,
    });
  };

  @action addCell = (componentName: string, initOptions?: any) => {
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

    this.emitEvent({
      type: "data:change",
    });

    return newCellData.id;
  };

  @action setLinkingPosition = (coord: Vector2d) => {
    this.buffer.link.target.x = coord.x;
    this.buffer.link.target.y = coord.y;
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

    this.emitEvent({
      type: "link",
      data: {
        source,
        target,
      },
    });
    this.clearLinkBuffer();
  };

  @action setStagePosition = (x: number, y: number) => {
    this.canvasData.x = x;
    this.canvasData.y = y;
  };

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

  getCellModel = (id: string) => {
    return this.cellsModelMap.get(id);
  };

  getCellInstance = (id: string) => {
    return this.cellsMap.get(id);
  };

  getCellsData = () => {
    return this.canvasData.cells;
  };

  getNodePosition = (id: string) => {
    const re = { x: 0, y: 0 };

    let curr: CellDataType | undefined = this.getCellData(id);

    while (curr) {
      re.x += curr.x;
      re.y += curr.y;
      curr = curr.parent
        ? (this.getCellData(curr.parent) as CellDataType)
        : undefined;
    }

    return re;
  };

  sendEvent = (cellId: string, params?: any) => {
    const events = this.eventMap.get(cellId);
    events &&
      events.forEach((event) => {
        event(params);
      });
  };

  registModel = (components: Record<string, typeof CellModel>) => {
    for (let key in components) {
      this.modelFactoriesMap.set(key, components[key]);
    }
  };

  registComponents = (components: Record<string, React.FC>) => {
    for (let key in components) {
      this.regist(key, components[key]);
    }
  };
}

export default FlowModel;

type A = {
  id: number;
} & {
  type: "node";
};

type C<T> = Override<A, T>;

const c: C<{
  id: string;
}> = {
  id: "asd",
  type: "node",
};
