import { cloneDeep } from "lodash";
import {
  action,
  observable,
  makeObservable,
  computed,
} from "mobx";
import { FlowModel } from "../Model";

export type CellDataType = {
  id: string;
  cellType: string;
  component: string;
  [key: string]: any;
};

export class CellModel {
  defaultData = (): any => ({
    id: "",
    component: "",
    cellType: "",
  });

  context: FlowModel;

  @observable
  data: CellDataType;

  @observable
  state: {
    isSelect: boolean;
    isLinking: boolean;
  } = {
      isSelect: false,
      isLinking: false,
    };

  constructor(data: any, context: FlowModel) {
    this.data = data;
    this.context = context;
    makeObservable(this);
  }

  @computed
  get isSelect() {
    return this.state.isSelect;
  }
  set isSelect(isSelect: boolean) {
    this.state.isSelect = isSelect;
  }

  getWrapperRef = () => {
    return this.context.getWrapperRef(this.data.id);
  }

  @action
  setData = (data: any, deepMerge: boolean = true) => {
    this.context.setCellData(this.data.id, data, deepMerge);
  }

  static getDefaultData() {
    const re = {};
    let curr = this as any;
    const factoryList = []

    // 合并父类metaData
    while (curr !== (CellModel)) {
      factoryList.push(curr)
      curr = curr.__proto__;
    }

    factoryList.reverse().forEach(factory => {
      Object.assign(re, (new factory).defaultData());
    })

    return cloneDeep(re) as CellDataType;
  }
}
