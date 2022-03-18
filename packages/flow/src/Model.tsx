import { action, observable, makeObservable } from "mobx";
// import { v4 } from "uuid";
import { arrayMove, findIndex, isRectsInterSect } from "./utils/util";
import { CellType } from "@/cells/Cell";
import { color } from "@/theme/style";
import { v4 } from "uuid";
import { union, without } from "lodash";
import { EdgeType } from "./cells/Edge";
import { PortType } from "@/scaffold/Port";
import { NodeType } from "./cells/Node";

export class FlowModel {
  constructor(eventSender?) {
    makeObservable(this);
    if (eventSender) this.eventBus.sender = eventSender;
  }
  setEventSender = (eventSender) => {
    this.eventBus.sender = eventSender;
  };

  setCellsDataMap = () => {
    this.canvasData.cells.forEach((cellData) => {
      this.setCellDataMap(cellData);
    });
  };
  setCellDataMap = (cellData) => {
    this.cellsDataMap.set(cellData.id, cellData);
    if (cellData.type === "node" && cellData.ports) {
      cellData.ports.forEach((portData) => {
        this.setCellDataMap(portData);
      });
    }
  };

  @observable
  hotKey = {
    MouseDown: false,
  };
  @action setHotKey = (key, value) => {
    this.hotKey[key] = value;
  };

  linkEdge = "Edge";
  @action setLinkEdge = (name: string) => {
    this.linkEdge = name;
  };

  @observable
  buffer = {
    isDragging: false,
    isSingleSelect: false,
    isWheeling: false,
    select: {
      single: false,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    },
    link: {
      source: undefined,
      target: {
        x: 0,
        y: 0,
      },
    },
  };

  @action setisSingleSelect = (isisSingleSelect: boolean) => {
    this.buffer.select.single = isisSingleSelect;
  };

  @action setMultiSelect = (select, onlySetPosition = false) => {
    const {
      buffer: { select: bufferSelect },
    } = this;

    Object.assign(bufferSelect, select);

    const right = Math.max(bufferSelect.start.x, bufferSelect.end.x);
    const x = Math.min(bufferSelect.start.x, bufferSelect.end.x);
    const y = Math.min(bufferSelect.start.y, bufferSelect.end.y);
    const bottom = Math.max(bufferSelect.start.y, bufferSelect.end.y);

    if (onlySetPosition) return;

    const re = [];
    this.cellsMap.forEach((cell) => {
      if (cell.props.data?.type === "node") {
        const instance = cell.wrapperRef.current;
        const bounds = instance.getClientRect({
          relativeTo: instance.getStage(instance),
        });
        // judge which nodes interact with 'select rect'
        if (
          isRectsInterSect(
            {
              x,
              y,
              width: right - x,
              height: bottom - y,
            },
            bounds
          )
        ) {
          re.push(cell.props.data.id);
        }
      }
    });

    this.setSelectedCells(re);
  };

  @action clearLinkBuffer = () => {
    this.buffer.link = {
      source: undefined,
      target: {
        x: 0,
        y: 0,
      },
    };
  };

  // 全局颜色，可以由用户自定义
  @observable color = color;

  // cell的<id, 实例>map，方便用id获取到组件实例
  cellsMap = new Map<string, React.Component<any, any> & any>();
  // cellData的<id, cellData>map，用来修改受控数据
  cellsDataMap = new Map<string, CellType>();

  // 注册节点到model，方便动态引用
  componentsMap = new Map();

  // 消息传递
  eventBus = {
    sender: undefined,
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

  // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
  @observable canvasData = {
    scale: { x: 1, y: 1 },
    x: 0,
    y: 0,
    cells: [],
  };

  @action clearSelect = () => {
    this.selectCells = [];
  };

  sendEvent = (data) => {
    this.eventBus.sender(data);
  };

  @action setStageScale = (x, y) => {
    this.canvasData.scale = {
      x,
      y,
    };
  };

  @action setStagePosition = (x, y) => {
    this.canvasData.x = x;
    this.canvasData.y = y;
  };

  @action setCanvasData = (canvasData) => {
    this.canvasData = canvasData;
  };

  @action setCellId = (data) => {
    data.id = v4();
  };

  @action setCellData = (id, data) => {
    const cellData = this.getCellData(id);

    Object.assign(cellData, {
      ...data,
    });
  };

  getLinkNode = (id) => {
    const re = [];
    const nodeData = this.getCellData(id) as NodeType;
    if (nodeData.ports)
      nodeData.ports.forEach((port: PortType) => {
        if (port.edges) {
          port.edges.forEach((edgeId) => {
            const edgeData = this.getCellData(edgeId) as EdgeType;
            const sourcePort = this.getCellData(edgeData.source) as PortType;
            const targetPort = this.getCellData(edgeData.target) as PortType;

            re.push(
              ...without(union([sourcePort.host], [targetPort.host]), id)
            );
          });
        }
      });

    return re;
  };

  @action deleCell = (id) => {
    const matchCell = this.canvasData.cells.find((cell) => cell.id === id);
    this.canvasData.cells.splice(
      findIndex(this.canvasData.cells, matchCell),
      1
    );

    return matchCell.id;
  };

  @action deleEdge = (id) => {};

  // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
  @action setAutoLayout = (layoutOption) => {};

  // 创建新的节点数据
  @action createCellData = (component, initOptions?) => {
    const id = v4();

    const metaData = JSON.parse(
      JSON.stringify(this.componentsMap.get(component).getMetaData())
    );

    return Object.assign(metaData, {
      id,
      ...initOptions,
    });
  };

  @action addCell = (componentName, initOptions) => {
    const newCellData = this.createCellData(componentName, initOptions);

    if (newCellData.ports) {
      newCellData.ports.forEach((port) => {
        port.host = newCellData.id;
        port.id = v4();
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

    return newCellData.id;
  };

  @action setLinkingPosition = (e) => {
    const cursorPos = e.currentTarget.getRelativePointerPosition();

    this.buffer.link.target.x = cursorPos.x;
    this.buffer.link.target.y = cursorPos.y;
  };

  @action link = (source, target) => {
    const sourceCellData = this.getCellData(source) as PortType;
    const targetCellData = this.getCellData(target) as PortType;

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

  @action
  moveTo(id, index) {
    const oldIndex = findIndex(this.canvasData.cells, this.getCellData(id));
    arrayMove(this.canvasData.cells, oldIndex, index);
  }

  getCellData = (id) => {
    return this.cellsDataMap.get(id);
  };

  getCellInstance = (id) => {
    return this.cellsMap.get(id);
  };
}

export default FlowModel;
