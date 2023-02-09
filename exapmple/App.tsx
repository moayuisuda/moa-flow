import {
  observer,
  NodeModel,
  Flow,
  ContextMenu,
  Port,
  useFlowModel,
  FlowModel,
  MiniMap,
} from "moa-flow";
import React, { useState } from "react";
import { useRef } from "react";
import { RelationEdge, RelationEdgeModel } from "./BizEdge";
import canvasData from "./test.json";

export const statusEnum = {
  warn: "yellow",
  error: "red",
  default: "#eee",
  success: "green",
};
class BizNodeModel extends NodeModel {
  defaultData = () => ({
    nodeName: "node 0",
    ports: [{ portType: "in" }, { portType: "out" }],
    status: "default",
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
        background: statusEnum[data.status],
      }}
    >
      <div>
        <h3>{data.nodeName}</h3>
        <button
          onClick={() => {
            model.setData({
              status: "success",
            });
          }}
        >
          {data.status}
        </button>
      </div>
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
      <div>
        <h1>HELLO</h1>
        <button
          onClick={() => {
            console.log(flowModelRef.current?.buffer.miniMap.showMiniMap);
            flowModelRef.current?.setMiniMap({
              showMiniMap: !flowModelRef.current?.buffer.miniMap.showMiniMap,
            });
          }}
        >
          {!flowModelRef.current?.buffer.miniMap.showMiniMap
            ? "打开小地图"
            : "关闭小地图"}
        </button>
      </div>
      <Flow
        width={1200}
        height={800}
        scaleBy={1.03}
        multiSelect
        flowModelRef={flowModelRef}
        components={{
          BizNode: BizNode,
          RelationEdge: RelationEdge,
        }}
        models={{
          BizNode: BizNodeModel,
          RelationEdge: RelationEdgeModel,
        }}
        canvasData={canvasData}
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
        <MiniMap
          nodeColor={(node) => statusEnum[node.status]}
          nodeStrokeColor={(node) => {
            const model = flowModelRef.current.getCellModel(node.id);
            const { isSelect } = model;
            return isSelect ? "blue" : "black";
          }}
          position={"right-bottom"}
          style={{
            width: 300,
            height: 200,
            border: "1px solid #eee",
            borderRadius: "5px",
          }}
        />
      </Flow>
    </div>
  );
};

export default App;
