import { observer } from "mobx-react";
import React from "react";
import { FlowContext } from "../Context";
import { Group } from "@antv/react-g";
@observer
class LinkingEdge extends React.Component<{ data: any }> {
  static contextType = FlowContext;
  declare context: React.ContextType<typeof FlowContext>;

  render() {
    const data = this.props.data;

    const RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);
    const id = "linkingEdge";

    if (!data.source) return <></>;

    this.context.buffer.link.edge = id;

    return (
      <Group>
        {React.createElement(RegistedEdge, {
          data: {
            id,
            ...this.props.data,
          },
        })}
      </Group>
    );
  }
}

export default LinkingEdge;
