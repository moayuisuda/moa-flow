import {
  observer,
  NodeModel,
  Flow,
  ContextMenu,
  Port,
  useFlowModel,
  FlowModel,
  EdgeModel,
} from "moa-flow";
import React from "react";
import { useRef } from "react";
import { BizEdge } from "./BizEdge";

class BizNodeModel extends NodeModel {
  defaultData = () => ({
    nodeName: "node 0",
    ports: [{ portType: "in" }, { portType: "out" }],
  });
}
const BizNode = observer(({ model }) => {
  const { data, isSelect } = model;

  const [inPort] = data.ports.filter((port) => port.portType === "in");
  const [outPort] = data.ports.filter((port) => port.portType === "out");

  const flowModel = useFlowModel();

  return (
    <div
      style={{
        padding: 48,
        border: isSelect ? "1px solid #1890ff" : "1px solid black",
      }}
    >
      <h3>{data.nodeName}</h3>
      <p>连接的节点数{model.getLinkNodes().length}</p>
      {/* moa-flow将连接桩抽象为了一个react组件
          你可以在任何位置像写普通react组件那样来写桩组件 */}
      <Port
        dir="left"
        anchor={() => ({
          // 线条的锚点位置
          x: 60,
          y: 160,
        })}
        data={inPort}
      >
        <span>流入</span>
      </Port>
      <input
        value={data.nodeName}
        type="text"
        onInput={(e) => model.setData({ nodeName: e.target.value })}
      />
      <Port
        dir="right"
        anchor={() => ({
          x: 240,
          y: 160,
        })}
        data={outPort}
      >
        <span>流出</span>
      </Port>
    </div>
  );
});

const App = () => {
  const flowModelRef = useRef<FlowModel>();
  return (
    <div>
      <h1>HELLO</h1>
      <Flow
        flowModelRef={flowModelRef}
        components={{
          BizNode: BizNode,
          BizEdge,
        }}
        models={{
          BizEdge: EdgeModel,
          BizNode: BizNodeModel,
        }}
        linkEdge="BizEdge"
        canvasData={{
          cells: [
            {
              component: "BizNode",
              nodeName: "node 0",
              x: 50,
              y: 50,
            },
            {
              component: "BizNode",
              nodeName: "node 1",
              x: 300,
              y: 300,
            },
          ],
        }}
      >
        <ContextMenu>
          <div style={{ boxShadow: "0px 0px 4px rgb(100,100,100)" }}>
            <button
              onClick={() => {
                const flowModel = flowModelRef.current as FlowModel;
                const { selectCells, deleCell } = flowModel;

                deleCell(selectCells[0]);
              }}
            >
              删除
            </button>
            <button
              onClick={() => {
                const flowModel = flowModelRef.current;
                flowModel.addCell("BizNode", {
                  x: 100,
                  y: 100,
                });
              }}
            >
              增加
            </button>
          </div>
        </ContextMenu>
      </Flow>
    </div>
  );
};

export default App;
