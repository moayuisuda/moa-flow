import { observer } from "mobx-react";
import styles from "./style.less";
import React from "react";
import { FlowContext } from "../../Context";
@observer
class ContextMenu extends React.Component<
{ children?: React.ReactNode }
> {
  static contextType = FlowContext;

  constructor(props: any) {
    super(props);
  }

  render() {
    if (!this.context.contextMenuVisible) return <></>;
    const { x, y } = this.context.buffer.contextMenu
    return (
      <div
        style={{
          left: x,
          top: y,
        }}
        className={styles["toolbar"]}
      >
        {this.props.children}
      </div>
    );
  }
}

export const getContextMenu = (
  children: React.ReactNode[] | React.ReactNode
) => {
  return React.Children.toArray(children).find((item: { type }) => {
    return item.type === ContextMenu;
  });
};

export { ContextMenu };
