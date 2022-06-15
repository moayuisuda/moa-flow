import { Button, message, Space } from "antd";
import "antd/dist/antd.css";
import { useEffect, useRef, useState } from "react";

import type { ModelType } from "@ali/flow-infra-g";
import { Canvas, Flow, RightClickPanel } from "@ali/flow-infra-g";

import { Context } from "./Context";
import FlowEdge from "./FlowEdge";
import GlobalSetting from "./GlobalSetting";
import InterfaceNode from "./InterfaceNode";

// @ts-ignore
import { getSchemaByTag } from "@alipay/connect-util";

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

    // 将默认连线设置为InterfaceEdge
    model.setLinkEdge("FlowEdge");
  }, []);

  const handleFinish = () => {
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

  return (
    <div className="App">
      <Context.Provider value={{ interfaceSchema }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" onClick={handleRestore}>
              还原
            </Button>
            <Button type="primary" onClick={handleFinish}>
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
      </Context.Provider>

      <Flow
        multiSelect
        modelRef={modelRef}
        canvasData={testData}
        onEvent={(e) => {
          // if (e.type === "data:change") return;
          // message.info(`[${e.type}]}`);
        }}
      >
        {/* Provider包裹画布组件，这个provider可以用 */}
        <Context.Provider value={{ interfaceSchema }}>
          <Canvas />
        </Context.Provider>

        {/* 右键菜单组件，可以拿到context */}
        <RightClickPanel>
          {(context: ModelType) => {
            return (
              <Space direction="vertical">
                <Button
                  onClick={() => {
                    const { getCellData, selectCells, getCellInstance } =
                      context;
                    const cellData = getCellData(selectCells[0]);

                    if (!(cellData && cellData.component === "InterfaceNode"))
                      message.info("请选择接口节点");
                    else {
                      const instance = getCellInstance(cellData.id);
                      instance.process();
                      message.info(`${cellData.title}开始执行`);
                    }
                  }}
                >
                  从此节点为终点执行
                </Button>
                <Button
                  onClick={(e) => {
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
    </div>
  );
}

export default App;
