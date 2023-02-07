import { EdgeModel, observer } from "moa-flow";
import React from "react";

export class RelationEdgeModel extends EdgeModel {
  bazier = false;
  defaultData = () => ({});
}

export const RelationEdge: React.FC<{ model: RelationEdgeModel }> = observer(
  ({ model }) => {
    const { d, isSelect } = model;

    const lineProps = {
      fill: "none",
      stroke: isSelect ? "#03a9f4" : "#5b7e92",
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
