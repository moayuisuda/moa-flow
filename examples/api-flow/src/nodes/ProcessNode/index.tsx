import {
  BaseNodeDataType,
  BaseNodeModel,
  NodeFrame,
  STATUS_ENUM,
} from "../BaseNode";
import { HANG_FLAG } from "../../constants";
import { Input, Modal } from "antd";
import { useRef, useState } from "react";
import NodeConfigForm from "./ProcessConfigForm";
import { observer } from "@ali/flow-infra-g";
import { EditOutlined } from "@ant-design/icons";

export type ProcessNodeDataType = {
  processSource: string;
} & BaseNodeDataType;
export class ProcessNodeModel extends BaseNodeModel<ProcessNodeDataType> {
  static defaultData = {
    title: "",
    type: "",
    cacheData: undefined,
    status: STATUS_ENUM.WAIT,
    ports: [
      {
        portType: "in",
      },
      {
        portType: "out",
      },
    ],
    x: 0,
    y: 0,
    id: "",
    component: "",
    cellType: "node",
    processSource: "success(source)",
  };

  // 执行实际的接口请求
  excute = async () => {
    const data = this.data;
    const inNodes = this.getInNodes();
    let source: any;

    if (inNodes.length) {
      if (inNodes.length === 1)
        source = (
          this.context.getCellModel(this.getInNodes()[0]) as BaseNodeModel
        ).output();
      else {
        /* 如果是多数据源聚合为下面这种形式
        {
          id0: 'data1',
          id1: 'data2'
        }
        */
        let re: Record<string, any> = {};
        source = this.getInNodes().forEach((nodeId) => {
          re[nodeId] = (
            this.context.getCellModel(nodeId) as BaseNodeModel
          ).output();
        });

        source = re;
      }
    }

    const runCodeWithVariables = (str: string) => {
      let isExcuteExplicit = false;
      let reRef = { value: undefined as any };

      const success = (e: any) => {
        isExcuteExplicit = true;
        reRef.value = e;
      };

      const error = (e: any) => {
        isExcuteExplicit = true;
        reRef.value = Promise.reject(e);
      };

      const hang = () => {
        isExcuteExplicit = true;
        reRef.value = Promise.resolve(HANG_FLAG);
      };

      const func = new Function(
        "source, success, error, hang",
        `
          ${str}
      `
      ); 

      func(source, success, error, hang);
      // 如果没有显式调用任何一个方法，则置为HANG
      if (!isExcuteExplicit) return HANG_FLAG;
      else return reRef.value;
    };

    return runCodeWithVariables(data.processSource);
  };
}

export const ProcessNode: React.FC<{ model: ProcessNodeModel }> = observer(
  ({ model }) => {
    const { data } = model;
    const [modalVisible, setModalVisible] = useState(false);
    const formRef = useRef<{
      submit: Function;
    }>();

    return (
      <NodeFrame
        model={model}
        actions={[
          <EditOutlined key="setting" onClick={() => setModalVisible(true)} />,
        ]}
      >
        <Input.TextArea
          value={data.processSource}
          onInput={(e) => {
            model.setData({
              processSource: e.currentTarget.value,
            });
          }}
        />

        <Modal
          title={data.id}
          destroyOnClose
          visible={modalVisible}
          width={800}
          onOk={async () => {
            await formRef.current?.submit();
            setModalVisible(false);
          }}
          onCancel={() => {
            setModalVisible(false);
          }}
        >
          <NodeConfigForm ref={formRef} id={data.id} />
        </Modal>
      </NodeFrame>
    );
  }
);
