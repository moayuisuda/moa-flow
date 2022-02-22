// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import { Group } from "react-konva";
import React from "react";
import { FlowContext } from "../Context";
import { observer } from "mobx-react";

type InteractorType = {
  x?: number;
  y?: number;
  id: string;
  draggable?: boolean;
  selectable?: boolean;
};

@observer
class Interactor extends React.Component<InteractorType, {}> {
  static contextType = FlowContext;

  syncDragPosition = (e) => {
    const model = this.context.model;

    model.setCellData(this.props.id, {
      x: e.currentTarget.attrs.x,
      y: e.currentTarget.attrs.y,
    });
  };

  render() {
    const {
      context: { model },
      props: { x, y, draggable = true, id, selectable = true },
    } = this;

    return (
      <Group
        x={x}
        y={y}
        draggable={draggable}
        onMouseDown={(e) => {
          if (selectable) {
            e.cancelBubble = true;
            model.setSelectedCells(id);
          }
        }}
        onDragMove={(e) => {
          this.syncDragPosition(e);
        }}
      >
        {this.props.children}
      </Group>
    );
  }
}

export default Interactor;
