// 这不是node的基类，只是一个外层wrapper用来包裹内容，并按需提供选中、拖拽等功能
import React from "react";
import { Observer } from "mobx-react";
import { FlowContext } from "../Context";
import { Port } from "./Port";
import { CellModel, NodeModel } from "../cells";
import { findIndex } from "../utils/util";

type InteractorType = {
  id: string;
  inSvg?: boolean;
  // topOnFocus?: boolean;
  children: React.ReactNode;
  model: CellModel;
  cellType: string;
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
      props: { id, inSvg = false, cellType },
    } = this;
    const onMouseDown = (
      e: React.MouseEvent<HTMLDivElement | SVGGElement, MouseEvent>
    ) => {
      const {
        selectCells,
        getCellModel,
        getCellData,
        canvasData: { cells },
        buffer: { select, drag },
      } = this.context;

      if (!select.isSelecting) {
        if (!selectCells.includes(this.props.id)) {
          context.setSelectedCells([id]);
        }

        // if (this.context.topOnFocus) {
        //   let moveToTopStack: string[];

        //   // if node has children, move its children to top too.
        //   if (cellType === "node") {
        //     const children = (getCellModel(id) as NodeModel).getChildren();
        //     moveToTopStack = [...children, id].sort((a, b) => {
        //       const aIndex = findIndex(cells, getCellData(a)) as number;
        //       const bIndex = findIndex(cells, getCellData(b)) as number;
        //       return aIndex - bIndex;
        //     });
        //   } else {
        //     moveToTopStack = [id];
        //   }

        //   moveToTopStack.forEach((id) => {
        //     this.context.moveTo(id, this.context.canvasData.cells.length - 1);
        //   });
        // }

        select.isSelecting = true;
        select.selectingDom = context.getWrapperRef(id)?.current as any;

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
