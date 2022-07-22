import { observer } from "mobx-react";
import React from "react";
import { FlowContext } from "../Context";
import { isUndefined } from "lodash";
import { CellModel } from "./Cell";
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

    const RegistedEdge = this.context.componentsMap.get(
      this.context.linkEdge
    ) as React.FC<any>;
    const Model = this.context.modelFactoriesMap.get(
      data.component
    ) as typeof CellModel;

    return (
      <g
        style={{
          pointerEvents: "none",
        }}
      >
        {React.createElement(RegistedEdge, {
          model: new Model(data, this.context),
          key: data.id,
        })}
      </g>
    );
  }
}
