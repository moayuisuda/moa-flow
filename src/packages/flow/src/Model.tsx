import { action, observable, makeObservable } from "mobx";
import { v4 } from "uuid";

export class FlowModel {
  constructor(eventSender) {
    makeObservable(this);
    this.eventBus.sender = eventSender;
  }

  // cell的<id, 实例>map，方便用id获取到组件实例
  cellsMap = new Map();
  // cellData的<id, cellData>map，用来修改受控数据
  cellsDataMap = new Map();

  // 注册节点到model，方便动态引用
  componentsMap = new Map();

  // 消息传递
  eventBus = {
    sender: undefined,
    receiver: undefined,
  };

  // 画布的渲染数据，之后的渲染大部分都为受控渲染，更改canvasData => 触发重新渲染
  @observable canvasData = {
    scale: { x: 1, y: 1 },
    x: 0,
    y: 0,
    cells: [],
  };

  sendEvent = (data) => {
    this.eventBus.sender(data);
  };

  @action setScale = (x, y) => {
    this.canvasData.scale.y = x;
    this.canvasData.scale.y += y;
  };

  @action setStagePosition = (x, y) => {
    this.canvasData.y = x;
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

  // 自动布局，用自动布局的三方库对每一个节点的x，y进行计算
  @action setAutoLayout = (layoutOption) => {};

  // 创建新的节点数据
  @action createCellData = (name, initOptions?) => {
    const id = v4();
    const metaData = this.componentsMap.get(name).metaData;
    return Object.assign(metaData, {
      id,
      ...initOptions,
    });
  };

  //test
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
