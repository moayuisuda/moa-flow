import { Rect } from "react-konva";
import React from "react";
import { FlowContext } from "../Context";
import { observer } from "mobx-react";

@observer
class SelectBoundsRect extends React.Component<{}, {}> {
  static contextType = FlowContext;
  render() {
    const {
      buffer: { select },
      color,
      hotKey,
    } = this.context;

    return (
      <>
        {!hotKey["Space"] && hotKey["LeftMouseDown"] && (
          <Rect
            x={Math.min(select.start.x, select.end.x)}
            y={Math.min(select.start.y, select.end.y)}
            width={Math.abs(select.start.x - select.end.x)}
            height={Math.abs(select.start.y - select.end.y)}
            stroke={color.primary}
          />
        )}
      </>
    );
  }
}

export default SelectBoundsRect;
