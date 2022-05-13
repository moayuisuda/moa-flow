import { Flow, RightClickPanel, Canvas } from "@ali/flow-infra-g";
import type { ModelType } from "@ali/flow-infra-g";
import { useEffect, useRef, useState } from "react";

import { Button, message } from "antd";
import "antd/dist/antd.css";

import BizEdge from "./BizEdge";
import BizNode from "./BizNode";
import BizContext from "./Context";

import testData from "./test.json";

function App() {
  const modelRef = useRef<ModelType>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    // 放一些额外的业务逻辑到实例里，在节点里可以在this.context中获取
    model.extra = { alert: (e: string) => message.info(e) };

    model.regist("BizNode", BizNode);
    model.regist("BizEdge", BizEdge);
    // 将默认连线设置为自定义连线
    model.setLinkEdge("BizEdge");

    model.setCanvasData(testData);

    // setInterval(() => {
    //   setCount((count) => count + 1);
    // }, 1000);
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
        {/* Provider包裹画布组件 */}
        <BizContext.Provider
          value={{
            count,
          }}
        >
          <Canvas />
        </BizContext.Provider>

        {/* 右键菜单组件，可以拿到context */}
        <RightClickPanel>
          {(context: ModelType) => {
            return (
              <Button
                onClick={() => {
                  const { getCellData, selectCells } = context;
                  message.info(
                    `当前选中的节点是 ${getCellData(selectCells[0])?.label}`
                  );
                }}
              >
                获取选中节点
              </Button>
            );
          }}
        </RightClickPanel>
      </Flow>
      <h1>111</h1>
      <h1>111</h1>
      <h1>111</h1>
      <h1>111</h1>
      <h1>111</h1>
    </div>
  );
}

export default App;
