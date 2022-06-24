import { Button, Divider, message, Space } from "antd";
import "antd/dist/antd.css";
import { useEffect, useRef, useState } from "react";
import type { ModelType } from "@ali/flow-infra-g";
import { Canvas, Flow, RightClickPanel } from "@ali/flow-infra-g";

import ProcessNode from "./nodes/ProcessNode";
import InterfaceNode from "./nodes/InterfaceNode";
import FlowEdge from "./FlowEdge";
import { Context } from "./Context";
import GlobalSetting from "./GlobalSetting";
import type {
  InterfaceNodeDataType,
  InterfacePortDataType,
} from "./nodes/InterfaceNode/types";
// @ts-ignore
import { getSchemaByTag } from "@alipay/connect-util";
import type { ISchema } from "./types";
import { flatten } from "lodash";

import { mockSchema } from "./mockData";
import testData from "./test.json";

function App() {
  const modelRef = useRef<ModelType>();
  const [interfaceSchema, setInterfaceSchema] = useState<ISchema>(mockSchema);
  const interfaceSchemaRef = useRef();
  const [globalSettingVisible, setGlobalSettingVisible] =
    useState<boolean>(false);
  const [nodeList, setNodeList] = useState<[string, Function][]>([]);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    // 注册节点
    model.regist("InterfaceNode", InterfaceNode);
    model.regist("ProcessNode", ProcessNode);
    model.regist("FlowEdge", FlowEdge);

    model.extra = {
      taskPool: {},
      interfaceSchemaRef,
    };

    // 将默认连线设置为FlowEdge
    model.setLinkEdge("FlowEdge");

    setNodeList(
      Array.from(modelRef.current?.componentsMap as Map<string, any>).filter(
        ([_, Component]) => {
          return Component.getMetaData().cellType === "node";
        }
      )
    );
  }, []);

  useEffect(() => {
    interfaceSchemaRef.current = interfaceSchema;

    interfaceSchemaRef.current = interfaceSchema;
  }, [interfaceSchema]);

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
    domain,
  }: {
    appId: string;
    tagName: string;
    domain: string;
  }) => {
    const schema = await getSchemaByTag({ appId, tagName });
    if (schema) {
      setInterfaceSchema({
        ...schema,
        domain,
      }
      );
    }
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
                      const { deleCell, selectCells } = context;
                      deleCell(selectCells[0])
                    }}>
                    删除
                  </Button>
                  <Button
                    onClick={() => {
                      const { getCellData, selectCells } = context;
                      const cellData = getCellData(selectCells[0]);
                      if (
                        !(
                          cellData &&
                          nodeList
                            .map(([nodeName]) => nodeName)
                            .includes(cellData.component)
                        )
                      )
                        message.info("请选择接口节点");
                      else {
                        message.info(`${cellData.title}开始执行`);
                        process(cellData.id);
                      }
                    }}
                  >
                    执行此节点
                  </Button>
                  <Button
                    onClick={() => {
                      const { getCell, selectCells } = context;
                      const cellInstance = getCell(selectCells[0]);

                      if (
                        !(
                          cellInstance &&
                          nodeList
                            .map(([nodeName]) => nodeName)
                            .includes(cellInstance.getData().component)
                        )
                      )
                        message.info("请选择接口节点");
                      else {
                        cellInstance.process();
                        message.info(
                          `开始执行到${cellInstance.getData().title}`
                        );
                      }
                    }}
                  >
                    以此节点为终点执行
                  </Button>
                  <Divider />
                  {nodeList.map(([name]) => {
                    return (
                      <Button
                        onClick={() => {
                          context.addCell(name, {
                            title: name,
                          });
                        }}
                      >
                        {`增添${name}节点`}
                      </Button>
                    );
                  })}
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
