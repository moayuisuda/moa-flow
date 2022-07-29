import { Button, message, Space } from "antd";
import "antd/dist/antd.css";
import { useEffect, useRef, useState } from "react";

import { CellDataType, Flow, ModelType, ContextMenu } from "@ali/flow-infra-g";

// @ts-ignore
import { flatten } from "lodash";
import testData from "./test.json";
import BaseNode from "./nodes/BaseNode";

function App() {
  const modelRef = useRef<ModelType>();
  const [nodeList, setNodeList] = useState<string[]>([]);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    setNodeList(["BaseNode"]);

    model.extra = {
      taskPool: {},
    };

    // 将默认连线设置为FlowEdge
  }, []);

  const handleSave = () => {
    const data = JSON.stringify(modelRef.current?.canvasData);
    localStorage.setItem("FLOW_DATA", data);
  };

  const handleRestore = () => {
    const data = localStorage.getItem("FLOW_DATA");
    if (data) modelRef.current?.setCanvasData(JSON.parse(data));
  };

  const getLeaveNodes = (id: string): string[] => {
    const model = modelRef.current as ModelType;
    const data = model?.getCellData(id) as CellDataType & { ports: any[] };

    const inPortData = data.ports.find(
      (portData) => portData.portType === "out"
    ) as CellDataType;

    const linkNodes = model
      .getPortLinkNodes(inPortData.id)
      .map((id) => model.getCellData(id)) as CellDataType[];

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
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" onClick={handleRestore}>
            还原
          </Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      </div>

      <Flow
        components={{
          BaseNode: BaseNode,
        }}
        linkEdge="FlowEdge"
        multiSelect
        modelRef={modelRef}
        // grid={40}
        canvasData={testData}
      >
        <ContextMenu>
          <Space direction="vertical">
            <Button
              onClick={() => {
                const { deleCell, selectCells } = modelRef.current as ModelType;
                deleCell(selectCells[0]);
              }}
            >
              删除
            </Button>
            <Button
              onClick={() => {
                const { getCellData, selectCells } =
                  modelRef.current as ModelType;
                const cellData = getCellData(selectCells[0]);
                if (
                  !(
                    cellData &&
                    nodeList
                      .map((nodeName) => nodeName)
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
                const { getCell, selectCells } = modelRef.current as ModelType;
                const cellInstance = getCell(selectCells[0]);

                if (
                  !(
                    cellInstance &&
                    nodeList
                      .map((nodeName) => nodeName)
                      .includes(cellInstance.getData().component)
                  )
                )
                  message.info("请选择接口节点");
                else {
                  cellInstance.process();
                  message.info(`开始执行到${cellInstance.getData().title}`);
                }
              }}
            >
              以此节点为终点执行
            </Button>
            {nodeList.map((name) => {
              return (
                <Button
                  key={name}
                  onClick={() => {
                    const initDatasMap = {
                      BaseNode: {
                        ports: [
                          {
                            portType: "out",
                          },
                        ],
                      },
                    };

                    const model = modelRef.current as ModelType;
                    (modelRef.current as ModelType).addCell(name, {
                      x: -model.x + model.width / 2,
                      y: -model.y + model.height / 2,
                      ...initDatasMap[name as keyof typeof initDatasMap],
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
    </div>
  );
}

export default App;
