// 这不是node的基类，只是一个外层wrapper用来包裹内容，并提供drag等功能
import { Group } from "react-konva";
import React from "react";
import { FlowContext } from "../Context";

type NodeProps = {
  x?: number;
  y?: number;
  id: string;
};

class NodeBase extends React.Component<NodeProps, {}> {
  static contextType = FlowContext;

  syncDragPosition = (e) => {
    const model = this.context.model;

    model.setCellData(this.props.id, {
      x: e.currentTarget.attrs.x,
      y: e.currentTarget.attrs.y,
    });
  };

  render() {
    console.log(this.props);
    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable={true}
        // 拖拽这种高频操作用非受控，异步设置data
        onDragEnd={(e) => {
          this.syncDragPosition(e);
        }}
      >
        {this.props.children}
      </Group>
    );
  }
}

export default NodeBase;
