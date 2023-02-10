import { EdgeModel } from "moa-flow";
import React from "react";

// export class BizEdgeModel extends EdgeModel {}
export const BizEdge: React.FC<{ model: EdgeModel }> = ({ model }) => {
  return <model.LineRender arrowProps={{ size: 10, strokeWidth: 5, stroke: 'red' }} />;
};
