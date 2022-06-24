// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import { Group } from "@antv/react-g";
import React from "react";
import { observer } from "mobx-react";
import { FlowContext } from "../Context";
import { Port } from "./Port";

type InteractorType = {
  x?: number;
  y?: number;
  id: string;
  draggable?: boolean;
  selectable?: boolean;
  topOnFocus?: boolean;
};
@observer
export class Interactor extends React.Component<InteractorType> {
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
        draggable = true,
        id,
        topOnFocus = true,
        selectable = true,
        ...others
      },
    } = this;

    return (
      <Group
        onRightdown={() => {
          const { selectCells } = this.context;

          if (selectable) {
            if (!selectCells.includes(this.props.id))
              context.setSelectedCells([id]);
          }
        }}
        onMousedown={(e) => {
          e.stopPropagation();

          const {
            selectCells,
            buffer: { select, drag },
          } = this.context;

          if (selectable) {
            if (!selectCells.includes(this.props.id))
              context.setSelectedCells([id]);

            // drag
            if (topOnFocus)
              this.context.moveTo(
                this.props.id,
                this.context.canvasData.cells.length - 1
              );

            select.isSelecting = true;

            drag.start.x = e.canvas.x;
            drag.start.y = e.canvas.y;
          }
        }}
        {...others}
        x={0}
        y={0}
      >
        {this.props.children}
      </Group>
    );
  }
}

Interactor.Port = Port;
