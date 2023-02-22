import { EdgeModel, observer, LineType } from "moa-flow";
import React from "react";

export class BizEdgeModel extends EdgeModel {
  protected lineType = LineType.ORTH;
  defaultData = () => ({});
}

export const BizEdge: React.FC<{ model: BizEdgeModel }> = observer(
  ({ model }) => {
    const { d } = model;

    const lineProps = {
      fill: "none",
      stroke: "red",
      strokeWidth: 1,
    };

    return (
      <g>
        <marker
          id="markerArrow"
          markerWidth="10"
          markerHeight="13"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" fill="#5b7e92" />
        </marker>
        <path
          onClick={() => {
            model.setData({
              selected: true,
            });
          }}
          {...lineProps}
          d={d}
        />
      </g>
    );
  }
);
