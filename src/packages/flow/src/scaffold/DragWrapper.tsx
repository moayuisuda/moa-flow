// 这不是node的基类，只是一个外层wrapper用来包裹内容，并提供drag等功能
import { Group } from "react-konva";
import React from "react";
import { FlowContext } from "../Context";
import { CellType } from "../cells/Cell";
import { observer } from "mobx-react";

type DragWrapperType = {
  x?: number;
  y?: number;
  id: string;
};

@observer
class DragWrapper extends React.Component<DragWrapperType, {}> {
  static contextType = FlowContext;

  syncDragPosition = (e) => {
    const model = this.context.model;

    model.setCellData(this.props.id, {
      x: e.currentTarget.attrs.x,
      y: e.currentTarget.attrs.y,
    });
  };

  render() {
    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable={true}
        onDragMove={(e) => {
          this.syncDragPosition(e);
        }}
      >
        {this.props.children}
      </Group>
    );
  }
}

export default DragWrapper;
