import { Flow, RightClickPanel, Canvas } from "@ali/flow-infra-g";
import type { ModelType } from "@ali/flow-infra-g";
import { useEffect, useRef, useState } from "react";

import { Button, message } from "antd";
import "antd/dist/antd.css";

import BizEdge from "./BizEdge";
import BizNode from "./BizNode";
import BizContext from "./Context";
import FuncNode from "./FuncNode";

import testData from "./test.json";

function App() {
  const modelRef = useRef<ModelType>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const model = modelRef.current as ModelType;

    // 注册节点
    model.regist("BizNode", BizNode);
    model.regist("BizEdge", BizEdge);
    model.regist("FuncNode", FuncNode);

    // 将默认连线设置为BizEdge
    model.setLinkEdge("BizEdge");

    // 设置画布数据
    model.setCanvasData(testData);

    setInterval(() => {
      // 向节点传递事件
      // model.sendEvent("func-1", {
      //   type: "top",
      //   data: {
      //     age: 10,
      //   },
      // });
    }, 1000);
  }, []);

  return (
    <div className="App">
      {/* react组件引用 */}
      <Flow
        multiSelect
        modelRef={modelRef}
        onEvent={(e) => {
          // if (e.type === "data:change") return;
          // message.info(`[${e.type}]}`);
        }}
      >
        {/* Provider包裹画布组件，这个provider可以用 */}
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
    </div>
  );
}

export default App;
