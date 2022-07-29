import {
  action,
  makeAutoObservable,
  observable,
  makeObservable,
  computed,
} from "mobx";
import React from "react";
import { FlowModel } from "../Model";

export type CellDataType = {
  id: string;
  cellType: string;
  component: string;
  [key: string]: any;
};

export class CellModel {
  static defaultData: CellDataType = {
    id: "",
    component: "",
    cellType: "",
  };

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
    // console.log(this.data);
    makeObservable(this);
  }

  @computed
  get isSelect() {
    return this.state.isSelect;
  }
  set isSelect(isSelect: boolean) {
    this.state.isSelect = isSelect;
  }

  getWrapperRef() {
    return this.context.getWrapperRef(this.data.id);
  }

  @action
  setData(data: any, rec: boolean = true) {
    this.context.setCellData(this.data.id, data, rec);
  }
}
