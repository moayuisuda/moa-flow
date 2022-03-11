import { Flow, mountFlow } from "flow";
import type { ModelType } from "flow";

import { useEffect, useRef } from "react";
import testData from "./test.json";
import MyNode from "./MyNode";
import Controller from "./Controller";

import "antd/dist/antd.css";

const randomIn = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function App() {
  // 可以获取到编辑器的model，有了model，外层想怎么操作都行
  // useCase react

  const modelRef = useRef<ModelType>();

  useEffect(() => {
    // 注册自定义节点;
    MyNode.regist(modelRef.current);
    // MyEdge.regist(modelRef.current);
    // 调用model中的方法，创建80个节点压测一下
    for (let i = 0; i < 1; i++) {
      modelRef.current?.addCell("MyNode", {
        x: 50 * i,
        y: 50 * i,
        label: `${1} ${Math.random()}`,
        ports: [
          {
            label: "haha",
          },
        ],
      });
    }
    // //------------------- 非react组件引用 ------------------
    // const { modelRef } = mountFlow(document.querySelector(".App") as Element, {
    //   canvasData: {
    //     scale: [0.5, 0.5],
    //     x: 0,
    //     y: 0,
    //     cells: [],
    //   },
    //   onLoad: (model: ModelType) => {
    //     MyNode.regist(model);
    //     // 也可以使用返回的ref调用
    //     // MyNode.regist(modelRef.current);
    //     model.addCell("MyNode", {
    //       x: 50,
    //       y: 50,
    //       label: `haha`,
    //       ports: [
    //         {
    //           label: "haha",
    //         },
    //       ],
    //     });
    //   },
    //   onEvent: (e: any) => {
    //     alert(JSON.stringify(e, null, "\t"));
    //   },
    // });
  }, []);

  return (
    <div className="App">
      {/* react组件引用 */}
      <Flow
        modelRef={modelRef}
        canvasData={testData}
        onEvent={(e: any) => {
          alert(JSON.stringify(e, null, "\t"));
        }}
      ></Flow>
      <Controller modelRef={modelRef}></Controller>
      <h1>HELLO</h1>
    </div>
  );
}

export default App;
