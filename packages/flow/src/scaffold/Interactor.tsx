// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import { Group } from "react-konva";
import React from "react";
import { observer } from "mobx-react";

import { FlowContext } from "@/Context";
import Port from "./Port";

type InteractorType = {
  x?: number;
  y?: number;
  id: string;
  draggable?: boolean;
  selectable?: boolean;
  topOnFocus?: boolean;
};

@observer
class Interactor extends React.Component<InteractorType, {}> {
  static contextType = FlowContext;
  static Port;

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
      props: {
        x,
        y,
        draggable = true,
        id,
        topOnFocus,
        selectable = true,
        ...others
      },
    } = this;

    return (
      <Group
        x={x}
        y={y}
        draggable={draggable}
        onMouseDown={(e) => {
          if (selectable) {
            e.cancelBubble = true;
            model.setSelectedCells([id]);
            model.setSingleSelect(true);
            if (topOnFocus)
              model.moveTo(this.props.id, model.canvasData.cells.length - 1);
          }
        }}
        onMouseUp={() => {
          model.setSingleSelect(false);
        }}
        onDragMove={(e) => {
          this.syncDragPosition(e);
        }}
        {...others}
      >
        {this.props.children}
      </Group>
    );
  }
}

Interactor.Port = Port;

export default Interactor;
