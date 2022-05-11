import { Flow, RightClickPanel } from "@ali/flow-infra-g";
import type { ModelType } from "@ali/flow-infra-g";
import { useEffect, useRef } from "react";

import { Button, message } from "antd";
import "antd/dist/antd.css";

import BizEdge from "./BizEdge";
import BizNode from "./BizNode";

import testData from "./test.json";

function App() {
  const modelRef = useRef<ModelType>();

  useEffect(() => {
    // 注册自定义节点;
    const model = modelRef.current as ModelType;

    model.regist("BizNode", BizNode);
    model.regist("BizEdge", BizEdge);

    model.setCanvasData(testData);
  }, []);

  return (
    <div className="App">
      {/* react组件引用 */}
      <Flow
        multiSelect
        modelRef={modelRef}
        canvasData={testData}
        onEvent={(e) => {
          // if (e.type === "data:change") return;
          // message.info(`[${e.type}]}`);
        }}
      >
        <RightClickPanel>
          {(context: ModelType) => {
            return (
              <Button
                onClick={() => {
                  message.info(
                    `当前选中的是 ${
                      context.getCellData(context.selectCells[0])?.label
                    }`
                  );
                }}
              >
                获取当前节点
              </Button>
            );
          }}
        </RightClickPanel>
      </Flow>
    </div>
  );
}

export default App;
