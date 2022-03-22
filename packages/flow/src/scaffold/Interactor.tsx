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

  constructor(props) {
    super(props);
  }

  render() {
    const {
      context,
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
          const {
            buffer: { drag },
          } = this.context;

          if (selectable) {
            e.cancelBubble = true;
            if (!this.context.selectCells.includes(this.props.id))
              context.setSelectedCells([id]);

            drag.isDragging = true;
            drag.movedToTop = false;
          }
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
