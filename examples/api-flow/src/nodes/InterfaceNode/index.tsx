import { Modal } from "antd";
import lodash from "lodash";
import { Context } from "../../Context";
import NodeConfigForm from "./NodeConfigForm";
import { InterfaceNodeDataType } from "./types";
import trcall from "./trcall";
import mockCall from "./mockcall";
// @ts-ignore
import { getInterfaceByName } from "@alipay/connect-util";
import { BaseNodeModel, STATUS_ENUM, NodeFrame } from "../BaseNode";
import { useState, useRef, useContext } from "react";
import { EllipsisOutlined, SettingOutlined } from "@ant-design/icons";

export class InterfaceNodeModel extends BaseNodeModel<InterfaceNodeDataType> {
  defaultData = () => ({
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
    interface: "",
    inputParams: [],
  });

  excute = () => {
    const { type: interfaceType, interface: interfaceArr, scene } = this.data;
    const interfaceSchema = this.context.extra.interfaceSchema;
    if (interfaceType !== "HTTP") {
      // 先用tr接口兼容监管的场景
      return trcall(interfaceArr, this.getParams(), interfaceSchema);
    } else {
      return mockCall(this.getUrl(interfaceArr, false), this.getParams(), {
        method: getInterfaceByName({
          schema: interfaceSchema,
          name: interfaceArr.join("."),
        })?.protocols.http?.method,
        scene,
      });
    }
  };

  // @TODO 把inputParams转化为接口的参数
  getParams() {
    const re = {} as {
      [key: string]: any;
    };

    const inputParams = this.data.inputParams;
    inputParams.forEach((param) => {
      if (param.assignmentType === "variable") {
        const nodeId = param.value?.[0];
        // 需要用节点ID取值
        const nodeData = this.context.getCellData(
          nodeId
        ) as InterfaceNodeDataType;
        // TODO 需要判断是否是array
        re[param.name] = lodash.get(
          { [nodeId]: nodeData.cacheData },
          param.value
        );
      } else re[param.name] = param.value;
    });

    return re;
  }

  // 转化为真实url
  getUrl(interfaceArr: string[] | string, includeDomain?: boolean) {
    const interfaceSchema = this.context.extra.interfaceSchema;
    const { domain, apis } = interfaceSchema;
    if (typeof interfaceArr === "string") {
      return `${domain}${interfaceArr}`;
    }
    const protocols = apis?.[interfaceArr.join(".")]?.protocols;
    const url = protocols.http?.path;
    if (includeDomain) return `${domain}${url}`;
    return url;
  }
}

export const InterfaceNode: React.FC<{
  model: InterfaceNodeModel;
}> = ({ model }) => {
  const { data } = model;
  const InterfaceContext = useContext(Context);

  const [modalVisible, setModalVisible] = useState(false);
  const formRef = useRef<{
    submit: Function;
  }>();

  return (
    <NodeFrame
      model={model}
      actions={[
        <SettingOutlined key="setting" onClick={() => setModalVisible(true)} />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <h1 style={{ margin: 0 }}>{"status: " + STATUS_ENUM[data.status]}</h1>
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
        <NodeConfigForm
          ref={formRef}
          id={data.id}
          interfaceSchema={InterfaceContext.interfaceSchema}
        />
      </Modal>
    </NodeFrame>
  );
};
