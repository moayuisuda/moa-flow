import { Flow, mountFlow } from "flow";
import type { ModelType } from "flow";

import { useEffect, useRef } from "react";
import testData from "./test.json";
import MyNode from "./MyNode";
import Controller from "./Controller";

import "antd/dist/antd.css";
import { message } from "antd";

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
    const { addCell } = modelRef.current as ModelType;
    addCell("MatrixNode", {
      x: 200,
      y: 500,
      ports: [
        {
          label: "name-in",
          portType: "in",
        },
        {
          label: "name",
          portType: "out",
        },
        {
          label: "age",
          portType: "out",
        },
        {
          label: "father",
          portType: "control-out",
        },
        {
          label: "grandfa",
          portType: "control-out",
        },
      ],
      label: "NODE 1 Matrix",
    });

    addCell("MatrixNode", {
      label: "NODE 2 Matrix",
      x: 550,
      y: 800,
      ports: [
        {
          label: "father",
          portType: "control-in",
        },
      ],
    });

    for (let i = 0; i < 300; i++) {
      addCell("MatrixNode", {
        x: randomIn(0, 3000),
        y: randomIn(0, 3000),
        label: `${1} ${Math.random()}`,
        ports: [
          {
            label: "haha",
            portType: "out",
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
        // canvasData={{
        //   scale: [0.5, 0.5],
        //   x: 0,
        //   y: 0,
        //   cells: [
        //     {
        //       type: "node",
        //       component: "MatrixNode",
        //       x: 1,
        //       y: 1,
        //       id: "0",
        //       ports: [],
        //       label: "haha",
        //     },
        //   ],
        // }}
        onEvent={(e) => {
          message.info(`[${e.type}] ${JSON.stringify(e.data)}`);
        }}
      ></Flow>

      {/* 同Flow一样Controller也可封装ReactDOM.render */}
      <Controller modelRef={modelRef}></Controller>
    </div>
  );
}

export default App;
