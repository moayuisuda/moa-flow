import { Button, message, Space } from "antd";
import "antd/dist/antd.css";
import { useEffect, useRef, useState } from "react";

import type { ModelType } from "@ali/flow-infra-g";
import { Canvas, Flow, RightClickPanel } from "@ali/flow-infra-g";

import { Context } from "./Context";
import FlowEdge from "./FlowEdge";
import GlobalSetting from "./GlobalSetting";
import InterfaceNode, {
  InterfaceNodeDataType,
  InterfacePortDataType,
} from "./InterfaceNode";

// @ts-ignore
import { getSchemaByTag } from "@alipay/connect-util";

import { flatten } from "lodash";
import { mockSchema } from "./mockData";
import testData from "./test.json";
import type { ISchema } from "./types";

function App() {
  const modelRef = useRef<ModelType>();
  const [interfaceSchema, setInterfaceSchema] = useState<ISchema>(mockSchema);
  const [globalSettingVisible, setGlobalSettingVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    // 注册节点
    model.regist("InterfaceNode", InterfaceNode);
    model.regist("FlowEdge", FlowEdge);

    model.extra = {
      taskPool: {},
    };

    // 将默认连线设置为FlowEdge
    model.setLinkEdge("FlowEdge");
  }, []);

  const handleSave = () => {
    const data = JSON.stringify(modelRef.current?.canvasData);
    localStorage.setItem("FLOW_DATA", data);
  };

  const handleRestore = () => {
    const data = localStorage.getItem("FLOW_DATA");
    if (data) modelRef.current?.setCanvasData(JSON.parse(data));
  };

  const getInterfaceSchema = async ({
    appId,
    tagName,
  }: {
    appId: string;
    tagName: string;
  }) => {
    const schema = await getSchemaByTag({ appId, tagName });
    if (schema) setInterfaceSchema(schema);
  };

  const getLeaveNodes = (id: string): string[] => {
    const model = modelRef.current as ModelType;
    const data = model?.getCellData(id) as InterfaceNodeDataType;

    const inPortData = data.ports.find(
      (portData) => portData.portType === "out"
    ) as InterfacePortDataType;

    const linkNodes = model
      .getPortLinkNodes(inPortData.id)
      .map((id) => model.getCellData(id)) as InterfaceNodeDataType[];

    if (linkNodes.length === 0) return [id];

    return flatten(linkNodes.map((nodeData) => getLeaveNodes(nodeData.id)));
  };

  const process = (id: string) => {
    const leaveNodes = getLeaveNodes(id);
    return Promise.all([
      leaveNodes.map((leaveNodeId) =>
        modelRef.current?.getCellInstance(leaveNodeId).process(id)
      ),
    ]);
  };

  return (
    <div className="App">
      <Context.Provider value={{ interfaceSchema }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" onClick={handleRestore}>
              还原
            </Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
            <Button
              style={{ marginLeft: 16 }}
              onClick={() => setGlobalSettingVisible(true)}
            >
              全局设置
            </Button>
          </Space>
        </div>
        <GlobalSetting
          visible={globalSettingVisible}
          setVisible={setGlobalSettingVisible}
          onSubmit={getInterfaceSchema}
        />

        <Flow multiSelect modelRef={modelRef} grid={40} canvasData={testData}>
          <Context.Provider value={{ interfaceSchema }}>
            <Canvas />
          </Context.Provider>

          <RightClickPanel>
            {(context: ModelType) => {
              return (
                <Space direction="vertical">
                  <Button
                    onClick={() => {
                      const { getCellData, selectCells } = context;
                      const cellData = getCellData(selectCells[0]);

                      if (!(cellData && cellData.component === "InterfaceNode"))
                        message.info("请选择接口节点");
                      else {
                        process(cellData.id);
                        message.info(`${cellData.title}开始执行`);
                      }
                    }}
                  >
                    执行此节点
                  </Button>
                  <Button
                    onClick={() => {
                      context.addCell("InterfaceNode");
                    }}
                  >
                    增添接口节点
                  </Button>
                </Space>
              );
            }}
          </RightClickPanel>
        </Flow>
      </Context.Provider>
    </div>
  );
}

export default App;
