import { observer } from "mobx-react";
import React from "react";
import { FlowContext } from "../Context";
import { isUndefined } from "lodash";
import { CellModel } from "./Cell";
import { callIfFn } from "../utils/util";
@observer
export class LinkingEdge extends React.Component<{ data: any }> {
  static contextType = FlowContext;
  declare context: React.ContextType<typeof FlowContext>;

  constructor(props: any) {
    super(props);
  }

  render() {
    const data = this.props.data;

    if (isUndefined(data.source)) return <></>;

    const linkEdge = callIfFn(this.context.linkEdge, [this.context.buffer.link.source, this.context.buffer.link.target]);
    const RegistedEdge = this.context.componentsMap.get(
      linkEdge
    ) as React.FC<any>;
    const Model = this.context.modelFactoriesMap.get(
      linkEdge
    ) as typeof CellModel;

    const defaultData = this.context.createCellData(linkEdge, {
      id: "LINKING_EDGE",
    });

    return (
      <g
        style={{
          pointerEvents: "none",
        }}
      >
        {React.createElement(RegistedEdge, {
          model: new Model(Object.assign(defaultData, data), this.context),
          key: data.id,
        })}
      </g>
    );
  }
}
