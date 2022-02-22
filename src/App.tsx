import Flow from "flow";
import testData from "./test.json";

function App() {
  return (
    <div className="App">
      <Flow
        canvasData={testData}
        onEvent={(e) => {
          alert(JSON.stringify(e, null, "\t"));
        }}
      ></Flow>
    </div>
  );
}

export default App;
