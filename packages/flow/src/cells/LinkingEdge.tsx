import { observer } from "mobx-react";
import React from "react";
import { FlowContext } from "../Context";
import { Group } from "@antv/react-g";
import { isUndefined } from "lodash";
@observer
class LinkingEdge extends React.Component<{ data: any }> {
  static contextType = FlowContext;
  declare context: React.ContextType<typeof FlowContext>;

  constructor(props: any) {
    super(props);
  }

  render() {
    const data = this.props.data;

    if (isUndefined(data.source)) return <></>;

    const RegistedEdge = this.context.componentsMap.get(this.context.linkEdge);

    return (
      <Group pointerEvents="none">
        {React.createElement(RegistedEdge, {
          data: {
            id: "LINKING_EDGE",
            ...this.props.data,
          },
        })}
      </Group>
    );
  }
}

export default LinkingEdge;
