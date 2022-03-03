import { action, observable, makeObservable } from "mobx";
import { v4 } from "uuid";
import { CellType } from "@/cells/Cell";
import { color } from "@/theme/style";

export class FlowModel {
  constructor(eventSender) {
    makeObservable(this);
    this.eventBus.sender = eventSender;
  }

  // 全局颜色，可以由用户自定义
  @observable color = color;

  // cell的<id, 实例>map，方便用id获取到组件实例
  cellsMap = new Map<string, React.ReactNode>();
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
  @action setSelectedCells = (id) => {
    // 多选
    // if (!this.selectCells.includes(id)) {
    //   this.selectCells.push(id);
    // }

    // 单选
    this.selectCells = [id];
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

  //   @action setScale;

  @action setCellData = (id, data) => {
    const cellData = this.getCellData(id);

    Object.assign(cellData, {
      ...data,
    });
  };

  @action deleCell = (id) => {
    const matchCellIndex = this.canvasData.cells.find((cell) => cell.id === id);
    this.canvasData.cells.splice(matchCellIndex, 1);
  };

  // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
  @action setAutoLayout = (layoutOption) => {};

  // 创建新的节点数据
  @action createCellData = (component, initOptions?) => {
    const id = v4();
    const metaData = this.componentsMap.get(component).getMetaData();

    return Object.assign(metaData, {
      id,
      ...initOptions,
    });
  };

  @action addNode = () => {
    this.canvasData.cells = this.canvasData.cells.concat([
      this.createCellData("TuringNode", {
        x: 400,
        y: 400,
        label: "NEW NODE",
      }),
    ]);
  };

  getCellData = (id) => {
    return this.cellsDataMap.get(id);
  };

  onConnect(data) {
    // this.eventBus.sender(data);
  }
}

export default FlowModel;
