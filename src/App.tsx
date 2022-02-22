import Flow from "flow";
import { useRef } from "react";
import testData from "./test.json";

function App() {
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
