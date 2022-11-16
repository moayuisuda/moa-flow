// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import React from "react";
import { Observer } from "mobx-react";
import { FlowContext } from "../Context";
import { Port } from "./Port";
import { CellModel } from "cells";

type InteractorType = {
  id: string;
  inSvg?: boolean;
  topOnFocus?: boolean;
  children: React.ReactNode;
  model: CellModel
};
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
      props: { id, topOnFocus = false, inSvg = false },
    } = this;

    const onMouseDown = (
      e: React.MouseEvent<HTMLDivElement | SVGGElement, MouseEvent>
    ) => {
      const {
        selectCells,
        buffer: { select, drag },
      } = this.context;

      if (!select.isSelecting) {
        if (!selectCells.includes(this.props.id)) {
          context.setSelectedCells([id]);
        }

        // drag
        if (topOnFocus)
          this.context.moveTo(
            this.props.id,
            this.context.canvasData.cells.length - 1
          );

        select.isSelecting = true;
        select.selectingDom = context.wrapperRefsMap.get(id)?.current as any

        const coord = this.context.getCursorCoord(e);
        drag.start.x = coord.x;
        drag.start.y = coord.y;
      }
    };

    return inSvg ? (
      <g
        style={{
          pointerEvents: "auto",
        }}
        onMouseDown={onMouseDown}
      >
        {this.props.children}
      </g>
    ) : (
      <div
        style={{
          pointerEvents: "auto",
        }}
        onMouseDown={onMouseDown}
      >
        {this.props.children}
      </div>
    );
  }
}

Interactor.Port = Port;
