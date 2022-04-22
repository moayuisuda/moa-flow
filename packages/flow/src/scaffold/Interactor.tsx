// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import { Group } from "react-konva";
import React from "react";
import { observer } from "mobx-react";

import { FlowContext } from "../Context";
import Port from "./Port";
import { EVT_LEFTCLICK } from "../constants";
import { PortDataType } from "./Port";

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
  declare context: React.ContextType<typeof FlowContext>;

  static Port: typeof Port;

  constructor(props: InteractorType) {
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
        topOnFocus = true,
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
            selectCells,
            buffer: { select, drag },
          } = this.context;

          if (selectable) {
            if (!selectCells.includes(this.props.id))
              context.setSelectedCells([id]);

            // drag
            if (e.evt.button === EVT_LEFTCLICK) {
              // @TODO 和drag的默认行为有歧义
              if (topOnFocus)
                this.context.moveTo(
                  this.props.id,
                  this.context.canvasData.cells.length - 1
                );

              select.isSelecting = true;

              drag.start.x = e.evt.x;
              drag.start.y = e.evt.y;

              drag.movedToTop = false;
            }
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
