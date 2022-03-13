import { action, observable, computed, makeObservable } from "mobx";
// import { v4 } from "uuid";
import { arrayMove, findIndex } from "./utils/util";
import { CellType } from "@/cells/Cell";
import { color } from "@/theme/style";
import { v4 } from "uuid";

export class FlowModel {
  constructor(eventSender) {
    makeObservable(this);
    this.eventBus.sender = eventSender;
  }

  @observable
  hotKey = {};

  registedEdge: undefined;

  @observable
  buffer = {
    select: {
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

  @action setMultiSelect = (select) => {
    const {
      buffer: { select: bufferSelect },
    } = this;

    Object.assign(bufferSelect, select);

    const right = Math.max(bufferSelect.start.x, bufferSelect.end.x);
    const left = Math.min(bufferSelect.start.x, bufferSelect.end.x);
    const top = Math.min(bufferSelect.start.y, bufferSelect.end.y);
    const bottom = Math.max(bufferSelect.start.y, bufferSelect.end.y);

    this.cellsMap.forEach((cell) => {
      if (cell.props.data?.type === "node") {
        const instance = cell.wrapperRef.current;
        const bounds = instance.getClientRect({
          relativeTo: instance.getStage(instance),
        });
        // judge which nodes interact with 'select rect'
        if (
          !(
            right < bounds.x ||
            left > bounds.x + bounds.width ||
            bottom < bounds.y ||
            top > bounds.y + bounds.height
          )
        ) {
          this.setSelectedCells(cell.props.data.id, false);
        }
      }
    });
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
  @action setSelectedCells = (id, isSingleSelect = true) => {
    // 多选
    if (isSingleSelect) {
      this.selectCells = [id];
    } else {
      if (!this.selectCells.includes(id)) {
        this.selectCells.push(id);
      }
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

  @action setScale = (x, y) => {
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

  @action deleCell = (id) => {
    const matchCell = this.canvasData.cells.find((cell) => cell.id === id);
    this.canvasData.cells.splice(
      findIndex(this.canvasData.cells, matchCell),
      1
    );

    return matchCell.id;
  };

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
    this.canvasData.cells.push(newCellData);

    return newCellData.id;
  };

  @action setLinkingPosition = (e) => {
    const cursorPos = e.currentTarget.getRelativePointerPosition();

    this.buffer.link.target.x = cursorPos.x;
    this.buffer.link.target.y = cursorPos.y;
  };

  @action link = (source, target) => {
    this.addCell("Edge", {
      source,
      target,
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

  onConnect(data) {
    // this.eventBus.sender(data);
  }
}

export default FlowModel;
