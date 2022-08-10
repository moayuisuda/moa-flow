import { Button, Divider, message, Space, Upload, Dropdown, Menu } from "antd";
import { PageContainer } from "@alipay/tech-ui";
import "antd/dist/antd.css";
import { useEffect, useRef, useState } from "react";
import type { ModelType } from "@ali/flow-infra-g";
import { Flow, ContextMenu, DagreLayout } from "@ali/flow-infra-g";

import { ProcessNode, ProcessNodeModel } from "./nodes/ProcessNode";
// import FlowEdge from "./FlowEdge";
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
import { InterfaceNodeModel, InterfaceNode } from "./nodes/InterfaceNode/index";

import * as colors from "@ant-design/colors";
import { BaseNodeModel } from "./nodes/BaseNode";
import { FlowEdgeModel } from "./FlowEdge";

type IGlobalSetting = {
  appId?: string;
  tagName?: string;
  domain?: string;
};

function App() {
  const modelRef = useRef<ModelType>();
  const [interfaceSchema, setInterfaceSchema] = useState<ISchema>(mockSchema);
  const [globalSetting, setGlobalSetting] = useState<IGlobalSetting>({});
  const [globalSettingVisible, setGlobalSettingVisible] =
    useState<boolean>(false);
  const [nodeList, setNodeList] = useState<[string, Function][]>([]);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    model.extra = {
      taskPool: {},
      interfaceSchema,
    };
    model.color.primary = colors.blue.primary as string;
    model.color.active = colors.blue.primary as string;

    // model.linkEdge = "FlowEdge";

    setNodeList(
      Array.from(
        modelRef.current?.modelFactoriesMap as Map<string, any>
      ).filter(([_, Component]) => {
        return Component.defaultData.cellType === "node";
      })
    );
    setTimeout(() => {
      // 默认还原
      // handleRestore();
    }, 1000);
  }, []);

  const handleSave = () => {
    const data = JSON.stringify({
      ...globalSetting,
      ...modelRef.current?.canvasData,
    });
    localStorage.setItem("FLOW_DATA", data);
  };

  const handleExport = () => {
    function saveJSON(data: any, filename: string) {
      if (!data) {
        alert("保存的数据为空");
        return;
      }
      if (!filename) filename = "json.json";
      let saveData = "";
      if (typeof data === "object") {
        saveData = JSON.stringify(data, undefined, 4);
      }
      var blob = new Blob([saveData], { type: "text/json" }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    }
    saveJSON(
      { ...globalSetting, ...modelRef.current?.canvasData },
      "data.json"
    );
  };

  const handleImport = ({ file, onSuccess }: any) => {
    const start = 0;
    const stop = file.size - 1;
    const reader = new FileReader();
    reader.onloadend = (evt) => {
      if (evt.target?.readyState == FileReader.DONE) {
        const content = evt.target.result as string;
        if (content) {
          const remoteData = JSON.parse(content);
          getInterfaceSchema(remoteData);
          modelRef.current?.setCanvasData(remoteData);
        }
        onSuccess();
      }
    };
    const blob = file.slice(start, stop + 1);
    reader.readAsText(blob, "utf-8");
  };

  const DEFAULT_CANVAS_DATA = {
    scale: 1,
    x: 0,
    y: 0,
    cells: [],
  };

  const handleRestore = () => {
    const data =
      localStorage.getItem("FLOW_DATA") || JSON.stringify(DEFAULT_CANVAS_DATA);
    const remoteData = JSON.parse(data);
    getInterfaceSchema(remoteData);
    if (data) modelRef.current?.setCanvasData(remoteData);
  };

  const getInterfaceSchema = async ({
    appId,
    tagName,
    domain,
  }: {
    appId?: string;
    tagName?: string;
    domain?: string;
  }) => {
    setGlobalSetting({ appId, tagName, domain });
    const schema = await getSchemaByTag({ appId, tagName });
    if (schema) {
      const interfaceSchema = {
        ...schema,
        appId,
        tagName,
        domain,
      }
      setInterfaceSchema(interfaceSchema);
      (modelRef.current as ModelType).extra.interfaceSchema = interfaceSchema;
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
        (modelRef.current?.getCellModel(leaveNodeId) as BaseNodeModel).process(
          id
        )
      ),
    ]);
  };

  return (
    <div className="App">
      <PageContainer
        title="联调链路"
        extra={
          <div>
            <Space>
              <Button onClick={() => {
                modelRef.current?.setLayout(new DagreLayout({
                  type: 'dagre',
                  rankdir: 'LR',
                  align: 'UR',
                  ranksep: 160,
                  nodesep: 80,
                  controlPoints: true,
                }))
                // 布局参考 https://x6.antv.vision/zh/docs/tutorial/advanced/layout#%E5%B8%83%E5%B1%80%E6%B5%81%E7%A8%8B
              }}>自动布局</Button>
              <Dropdown.Button
                type="primary"
                overlay={
                  <Menu>
                    <Menu.Item key={'import'}>
                      <Upload
                        customRequest={handleImport}
                        fileList={[]}
                        accept=".json"
                      >
                        文件导入
                      </Upload>
                    </Menu.Item>
                  </Menu>
                }
                onClick={handleRestore}
              >
                还原
              </Dropdown.Button>
              <Dropdown.Button
                type="primary"
                overlay={
                  <Menu>
                    <Menu.Item onClick={handleExport} key={'export'}>导出文件</Menu.Item>
                  </Menu>
                }
                onClick={handleSave}
              >
                保存
              </Dropdown.Button>
              <Button
                style={{ marginLeft: 16 }}
                onClick={() => setGlobalSettingVisible(true)}
              >
                全局设置
              </Button>
            </Space>
          </div>
        }
      >
        <Context.Provider value={{ interfaceSchema }}>
          <GlobalSetting
            visible={globalSettingVisible}
            setVisible={setGlobalSettingVisible}
            onSubmit={getInterfaceSchema}
            defaultData={globalSetting}
          />
          <Flow
            // view
            components={{
              InterfaceNode: InterfaceNode,
              ProcessNode: ProcessNode,
            }}
            // model
            models={{
              InterfaceNode: InterfaceNodeModel,
              ProcessNode: ProcessNodeModel,
              Edge: FlowEdgeModel,
            }}
            width={window.innerWidth}
            height={window.innerHeight}
            multiSelect
            modelRef={modelRef}
            grid={40}
            canvasData={testData}
          >
            <ContextMenu>
              <Space direction="vertical">
                <Button
                  onClick={() => {
                    const { deleCell, selectCells } =
                      modelRef.current as ModelType;
                    deleCell(selectCells[0]);
                  }}
                >
                  删除
                </Button>
                <Button
                  onClick={() => {
                    const { getCellModel, selectCells } =
                      modelRef.current as ModelType;
                    const nodeModel = getCellModel(selectCells[0]);

                    if (
                      !(
                        nodeModel &&
                        nodeList
                          .map(([nodeName]) => nodeName)
                          .includes(nodeModel.data.component)
                      )
                    )
                      message.info("请选择接口节点");
                    else {
                      message.info(`${nodeModel.data.title}开始执行`);
                      process(nodeModel.data.id);
                    }
                  }}
                >
                  执行此节点及后续节点
                </Button>
                <Button
                  onClick={() => {
                    const { getCellModel, selectCells } =
                      modelRef.current as ModelType;
                    const nodeModel = getCellModel(selectCells[0]);

                    if (
                      !(
                        nodeModel &&
                        nodeList
                          .map(([nodeName]) => nodeName)
                          .includes(nodeModel.data.component)
                      )
                    )
                      message.info("请选择接口节点");
                    else {
                      (nodeModel as InterfaceNodeModel).process();
                      message.info(`开始执行到${nodeModel.data.title}`);
                    }
                  }}
                >
                  以此节点为终点执行
                </Button>
                <Divider />
                {nodeList.map(([name]) => {
                  return (
                    <Button
                      key={name}
                      onClick={() => {
                        const model = modelRef.current as ModelType;
                        (modelRef.current as ModelType).addCell(name, {
                          title: name,
                          x: -model.x + model.width / 2,
                          y: -model.y + model.height / 2,
                        });
                        model.contextMenuVisible = false;
                      }}
                    >
                      {`增添${name}节点`}
                    </Button>
                  );
                })}
              </Space>
            </ContextMenu>
          </Flow>
        </Context.Provider>
      </PageContainer>
    </div>
  );
}

export default App;
