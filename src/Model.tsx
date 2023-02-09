import { cloneDeep, debounce, merge, union, without } from "lodash";
import { action, makeObservable, observable, computed } from "mobx";
import React from "react";
import { v4 } from "uuid";
import { CellDataType, CellModel } from "./cells/Cell";
import { Edge, EdgeDataType, EdgeModel } from "./cells/Edge";
import { NodeDataType, NodeModel, NodeData } from "./cells/Node";
import { Port, PortDataType } from "./components";
import { color } from "./theme/style";
import { AllCellDataType, CanvasDataType, Vector2d } from "./typings/common";
import {
  arrayMove,
  findIndex,
  isRectsInterSect,
  remove,
  isVector2d,
} from "./utils/util";
import { getRelativeBoundingBox } from "./utils/coords";

type EventSender = (data: any) => void;
export class FlowModel {
  eventMap = new Map<string, Map<string, Function>>();

  constructor(eventSender?: EventSender) {
    makeObservable(this);
    if (eventSender) this.eventBus.sender = eventSender;
    this.addStep();
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
    Object.assign(cellData, this.getFullNodeData(cellData.component, cellData));

    this.cellsDataMap.set(cellData.id, cellData);

    function isNodeDataType(t: AllCellDataType): t is NodeDataType {
      return t.cellType === "node";
    }

    if (cellData.cellType === "port") return;

    if (!this.modelFactoriesMap.get(cellData.component)) {
      console.warn(
        `[moa-flow] can not find model match component ${cellData.component}, use default NodeModel`
      );
    }

    const Model =
      (this.modelFactoriesMap.get(cellData.component) as typeof CellModel) ||
      NodeModel;
    const cellModel = new Model(cellData, this);
    this.cellsModelMap.set(cellData.id, cellModel);

    if (isNodeDataType(cellData)) {
      if (cellData.ports) {
        cellData.ports.forEach((portData: AllCellDataType) => {
          this.setCellDataMap(portData);
        });
      }
    }
  }

  extra: any = {};
  isInitEvents = false;
  multiSelect = false;
  scaleBy = 1.01;
  shrinkTimes = 10;
  isMiniMap = false;

  pendingRender: boolean = true;
  @action
  trigRender = () => {
    this.pendingRender = false;
  };
  @action
  pendRender = () => {
    this.pendingRender = true;
  };

  @observable private _width: number = 1000;
  @computed
  get width() {
    return this._width;
  }
  set width(width: number) {
    this._width = width as number;
  }

  @observable private _height: number = 600;
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

  @observable private _grid: number = 0;
  @computed
  get grid() {
    return this._grid;
  }
  set grid(grid: number) {
    this._grid = grid;
  }

  private _linkEdge = "Edge";
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

  @action
  setContextMenuPos = (pos: Vector2d) => {
    this.buffer.contextMenu.x = pos.x;
    this.buffer.contextMenu.y = pos.y;
  };

  @computed
  get contextMenuPos() {
    const { x, y } = this.buffer.contextMenu;

    const refBounding = this.refs.stageRef?.getBoundingClientRect() as {
      x: number;
      y: number;
    };
    return {
      x: (x - refBounding.x) / this.scale - this.x,
      y: (y - refBounding.y) / this.scale - this.y,
    };
  }

  refs = {
    stageRef: null as HTMLDivElement | null,
    svgContainerRef: null as SVGElement | null,
    divContainerRef: null as HTMLDivElement | null,
  };

  @observable
  hotKey = {
    RightMouseDown: false,
    LeftMouseDown: false,
    Space: false,
    MetaLeft: false,
    ControlLeft: false,
  };
  @action setHotKey = (
    key:
      | "RightMouseDown"
      | "LeftMouseDown"
      | "Space"
      | "MetaLeft"
      | "ControlLeft",
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
    debug: {
      x: 0,
      y: 0,
    },
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
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
      selectingDom: undefined,
      isSelecting: false, // 鼠标按下还没有松开的状态
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    },
    miniMap: {
      dragging: false,
      showMiniMap: false,
      mapDragging: false,
      mapScale: 1,
      mapPosition: [0, 0],
      boundingRect: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
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

  isSelecting(e: any) {
    const selectingDom = this.buffer.select.selectingDom as any;
    if (!selectingDom) return false;
    if (selectingDom.contains(e.target)) return true;
    else return false;
  }

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
  getCursorCoord = (e: React.MouseEvent, isCanvasCoord: boolean = true) => {
    const stageBounds = this.refs.stageRef?.getBoundingClientRect() as DOMRect;

    if (isCanvasCoord) {
      return {
        x: (e.clientX - stageBounds.x) / this.scale - this.x,
        y: (e.clientY - stageBounds.y) / this.scale - this.y,
      };
    } else {
      return {
        x: e.clientX - stageBounds.x,
        y: e.clientY - stageBounds.y,
      };
    }
  };

  fit = (nodeWidth: number, nodeHeight: number) => {
    const { canvasData, width, height } = this;
    const [first, ...others] = canvasData.cells;

    const LT = { x: first.x, y: first.y };
    const RB = { x: first.x + nodeWidth, y: first.y + nodeHeight };

    others.forEach((cellData) => {
      const { x, y } = cellData;
      if (x <= LT.x) LT.x = x;
      if (y <= LT.y) LT.y = y;
      if (x + nodeWidth >= RB.x) RB.x = x + nodeWidth;
      if (y + nodeHeight >= RB.y) RB.y = y + nodeHeight;
    });

    const boundingRect = {
      x: LT.x,
      y: LT.y,
      width: RB.x - LT.x,
      height: RB.y - LT.y,
    };
    const scaleX = width / this.scale / boundingRect.width;
    const scaleY = height / this.scale / boundingRect.height;

    // 取缩小程度更小的值保证包含
    const newScale = Math.min(scaleX, scaleY);
    this.scale = newScale * this.scale;

    // 缩小数值更小的维度，会有剩余空间
    const spareDir = scaleX < scaleY ? "y" : "x";
    const spareX =
      spareDir === "x" ? (width / this.scale - boundingRect.width) / 2 : 0;
    const spareY =
      spareDir === "y" ? (height / this.scale - boundingRect.height) / 2 : 0;

    this.setStagePosition(-boundingRect.x + spareX, -boundingRect.y + spareY);
  };

  getLocalBBox = (id: string) => {
    const dom = this.wrapperRefsMap.get(id)?.current as HTMLDivElement;

    return getRelativeBoundingBox(
      dom,
      this.refs.divContainerRef as HTMLDivElement
    );
  };

  isCellExist = (id: string) => {
    return this.canvasData.cells.find((cell) => cell.id === id);
  };

  @action setCanvasData = (canvasData: Partial<CanvasDataType>) => {
    const newData = cloneDeep(Object.assign(this.canvasData, canvasData));

    newData.cells.forEach((cellData) => {
      this.insertRuntimeState(cellData);
    });

    this.canvasData = newData;
    // 这里考虑到react会复用实例，所以不能简单地清除cellsMap
    // this.cellsDataMap.clear();
    // this.cellsMap.clear();
    this.setCellsDataMap();
  };

  @action setCellId = (data: CellDataType) => {
    data.id = v4();
  };

  @action setCellData = (id: string, data: any, deepMerge: boolean = true) => {
    const cellData = this.getCellData(id);

    if (!deepMerge) Object.assign(cellData, data);
    else merge(cellData, data);
    this.addStep();
  };

  /**
   * @description 获取某个node连接的所有edge
   */
  getNodeEdges = (nodeId: string) => {
    const re: string[] = [];
    const nodeData = this.getCellData(nodeId) as NodeDataType;
    if (nodeData?.ports)
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
    portData?.edges?.forEach((edgeId) => {
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
    portData?.edges?.forEach((edgeId) => {
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
    if (nodeData?.ports)
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
    if (nodeData?.ports)
      nodeData.ports.forEach((portData: PortDataType) => {
        re.push(...this.getPortLinkNodes(portData.id));
      });

    return re;
  };

  @action deleCell = (id: string) => {
    const matchCell = this.getCellData(id);
    if (!matchCell) {
      console.error("[moa-flow] can not find match dele Cell");
      return;
    }

    if (matchCell.cellType === "edge") this.clearPortEdge(matchCell.id);
    if (matchCell.cellType === "node" && this.getNodeEdges(id).length) {
      this.getNodeEdges(id).forEach((edgeId) => {
        this.deleCell(edgeId);
      });
    }

    this.selectCells.includes(id) && remove(this.selectCells, id);
    remove(this.canvasData.cells, matchCell);
    this.cellsMap.delete(id);
    this.cellsDataMap.delete(id);
    this.cellsModelMap.delete(id);

    this.addStep(); //删除cell时添加redo记录
    return matchCell.id;
  };

  snap = (vector: Vector2d) => {
    const grid = this.grid as number;
    return {
      x: Math.round(vector.x / grid) * grid,
      y: Math.round(vector.y / grid) * grid,
    };
  };

  @action
  setLayout = (layout: any) => {
    const nodesData = this.canvasData.cells.filter((cellData) => {
      return cellData.cellType !== "edge";
    });
    const edgesData = this.canvasData.cells.filter(
      (cellData: CellDataType) => cellData.cellType === "edge"
    );

    const result = layout.layout({
      nodes: nodesData,
      edges: edgesData.map((edgeData) => {
        return {
          source: this.getCellData(edgeData.source)?.host,
          target: this.getCellData(edgeData.target)?.host,
        };
      }),
    });

    if (!result) {
      console.warn("[moa-flow] setlayout failed");
      return [];
    }
    this.canvasData.cells = (result.nodes || [])
      .map((nodeData: NodeDataType) => {
        return this.grid
          ? Object.assign(
              nodeData,
              this.snap({
                x: nodeData.x,
                y: nodeData.y,
              })
            )
          : nodeData;
      })
      .concat(edgesData);

    this.addStep();
  };

  getNodesData = () => {
    return this.canvasData.cells.filter((cell) => cell.cellType === "node");
  };

  getEdgesData = () => {
    return this.canvasData.cells.filter((cell) => cell.cellType === "edge");
  };

  createCellData = (component: string, initOptions?: any) => {
    const id = v4();

    const metaData = Object.assign(
      (
        (this.modelFactoriesMap.get(component) as typeof CellModel) || NodeModel
      ).getDefaultData(),
      {
        component,
      }
    );

    this.insertRuntimeState(metaData);

    return Object.assign(metaData, {
      id: metaData.id || id,
      ...initOptions,
    });
  };

  getFullNodeData = (componentName: string, initOptions?: any) => {
    const newCellData = this.createCellData(componentName, initOptions);
    if (newCellData.ports) {
      newCellData.ports.forEach((port: PortDataType) => {
        Object.assign(port, {
          host: newCellData.id,
          cellType: "port",
          id: port.id || v4(),
          edges: port.edges || [],
          source: undefined,
          target: undefined,
        });
      });
    }

    return newCellData;
  };

  @action addCell = (componentName: string, initOptions?: any) => {
    const data = this.getFullNodeData(componentName, initOptions);
    this.canvasData.cells.push(data);
    this.setCellDataMap(
      this.canvasData.cells[this.canvasData.cells.length - 1]
    );

    // console.log(
    //   newCellData,
    //   this.canvasData.cells[this.canvasData.cells.length - 1]
    // ); // 两者不是一个对象，后者是proxy
    this.addStep();

    return data.id;
  };
  @action setMiniMap = (miniMap: {
    mapScale?: number;
    mapDragging?: boolean;
    dragging?: boolean;
    mapPosition?: number[] | number[];
    showMiniMap?: boolean;
    boundingRect?: { width: number; height: number; x: number; y: number };
  }) => {
    this.buffer.miniMap = {
      ...this.buffer.miniMap,
      ...miniMap,
    };
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
    return edgeId;
  };

  @action setStagePosition = (x: number, y: number) => {
    this.canvasData.x = x;
    this.canvasData.y = y;
  };

  /**
   *
   * @description 调整某个Cell的层级
   */
  @action
  moveTo = (id: string, index: number) => {
    const oldIndex = findIndex(
      this.canvasData.cells,
      this.getCellData(id)
    ) as number;
    arrayMove(this.canvasData.cells, oldIndex, index);
  };

  getCell = (id: string) => {
    return this.cellsMap.get(id);
  };

  getCellData = (id: string) => {
    return this.cellsDataMap.get(id);
  };

  getCellModel = (id: string) => {
    return this.cellsModelMap.get(id);
  };

  getPortInstance = (id: string) => {
    return this.cellsMap.get(id);
  };

  getCellsData = () => {
    return this.canvasData.cells;
  };

  getNodePosition = (id: string) => {
    // const re = { x: 0, y: 0 };

    let curr: CellDataType | undefined = this.getCellData(id) as NodeDataType;

    // while (curr) {
    //   re.x += curr.x;
    //   re.y += curr.y;
    //   curr = curr.parent
    //     ? (this.getCellData(curr.parent) as CellDataType)
    //     : undefined;
    // }

    // return re;

    return {
      x: curr.x,
      y: curr.y,
    };
  };

  moveNodesRecursively = (nodeId: string, movement: Vector2d) => {
    const cellData = this.getCellData(nodeId) as NodeDataType;
    this.setCellData(cellData.id, {
      x: cellData.x + movement.x,
      y: cellData.y + movement.y,
    });

    // 如果节点有children，则一起移动children
    const children = (
      this.getCellModel(cellData.id) as NodeModel
    ).getChildren();
    if (children.length) {
      children.forEach((childId) => {
        this.moveNodesRecursively(childId, movement);
      });
    }
  };

  registModels = (models: Record<string, typeof CellModel>) => {
    for (let key in models) {
      this.modelFactoriesMap.set(key, models[key]);
    }
  };

  registComponents = (components: Record<string, React.FC>) => {
    for (let key in components) {
      this.regist(key, components[key]);
    }
  };

  @action
  fitParentSize = () => {
    let parentSize;
    const dom = this.refs.stageRef;
    if (dom) {
      const container = dom.parentNode;
      if (container) {
        const style = getComputedStyle(container as any);
        parentSize = {
          width: parseFloat(style.width),
          height: parseFloat(style.height),
        };
      }
    }

    if (parentSize) this.size = parentSize;
  };

  private undoList: CanvasDataType[] = [];
  private redoList: CanvasDataType[] = [];

  addStep = debounce(() => {
    const cpoiedCanvasData = cloneDeep(this.canvasData);
    this.undoList = [...this.undoList, cpoiedCanvasData];
    this.redoList = [];

    this.emitEvent({
      type: "data:change",
    });
  }, 100);

  undo = () => {
    if (this.undoList.length >= 2) {
      const current = this.undoList.pop() as CanvasDataType;
      const lastUndo = this.undoList[this.undoList.length - 1];
      this.setCanvasData(lastUndo);
      this.redoList.push(current); // undo时将当前画布数据推入redoList中

      // 最大深度100，大于一百时将redoList第一项抛出 可以考虑添加最大可撤回次数props配置
      if (this.undoList.length >= 100) {
        this.undoList.shift();
      }
    }
  };
  redo = () => {
    if (this.redoList.length > 0) {
      const lastRedo = this.redoList.pop() as CanvasDataType;
      this.undoList.push(lastRedo); // redo时将redoList 最后一项推入 undoList中
      this.setCanvasData(lastRedo);
    }
  };
}

export default FlowModel;
