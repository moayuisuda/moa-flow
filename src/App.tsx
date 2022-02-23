import Flow from "flow";
import { useRef } from "react";
import testData from "./test.json";

function App() {
  // 可以获取到编辑器的model，有了model，外层想怎么操作都行
  const modelRef = useRef();
  Promise.resolve().then(() => {
    console.log({ modelRef });
  });

  return (
    <div className="App">
      <Flow
        modelRef={modelRef}
        canvasData={testData}
        onEvent={(e) => {
          alert(JSON.stringify(e, null, "\t"));
        }}
      ></Flow>
    </div>
  );
}

export default App;
