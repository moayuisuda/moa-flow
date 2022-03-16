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
class Interactor extends React.Component<InteractorType> {
  static contextType = FlowContext;
  static Port;

  local = {
    isDragging: false,
  };

  syncDragPosition = (e) => {
    const model = this.context.model;

    model.setCellData(this.props.id, {
      x: e.currentTarget.attrs.x + e.evt.movementX,
      y: e.currentTarget.attrs.y + e.evt.movementY,
    });
  };

  constructor(props) {
    super(props);
    console.log("ins");
  }

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
        onMouseDown={(e) => {
          if (selectable) {
            e.cancelBubble = true;
            model.setSelectedCells([id]);
            // 防止单选重叠时选到下面重叠的节点
            model.setisSingleSelect(true);

            model.buffer.isDragging = true;
            console.log("down", this.local.isDragging);
            if (topOnFocus)
              model.moveTo(this.props.id, model.canvasData.cells.length - 1);
          }
        }}
        onMouseUp={() => {
          model.buffer.isDragging = false;
          model.setisSingleSelect(false);
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
