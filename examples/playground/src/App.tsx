import { Flow, Cell, Interactor } from "flow";
import { useRef } from "react";
import testData from "./test.json";

function App() {
  // 可以获取到编辑器的model，有了model，外层想怎么操作都行
  console.log(Flow);

  // useCase react
  const modelRef = useRef();
  Promise.resolve().then(() => {
    console.log({ modelRef });
  });

  return (
    <div className="App">
      <Flow
        modelRef={modelRef}
        canvasData={testData}
        onEvent={(e: any) => {
          alert(JSON.stringify(e, null, "\t"));
        }}
      ></Flow>
      <h1>HELLO</h1>
    </div>
  );

  // // useCase umd
  // const { model, graph } = new Flow();
  // graph.data(testData);
  // Inspector.registComponent(model);

  // graph.graph.mount("#app");
}

export default App;
