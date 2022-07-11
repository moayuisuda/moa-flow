import { observer } from "mobx-react";
import styles from "./style.less";
import React from "react";
import { FlowContext } from "../../Context";
import { STAGE_ID } from "../../constants";
@observer
class ContextMenu extends React.Component<
  {},
  { pos: { x: number; y: number } }
> {
  static contextType = FlowContext;

  initStageEvent = () => {
    document
      .querySelector("#" + STAGE_ID)
      ?.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.context.contextMenuVisible = true;

        this.setState({
          pos: {
            x: e.clientX,
            y: e.clientY,
          },
        });
      });
  };

  componentDidMount(): void {
    // 子组件会在commit阶段先挂载触发didMount
    Promise.resolve().then(() => {
      this.initStageEvent();
    });
  }

  constructor(props: any) {
    super(props);

    this.state = {
      pos: {
        x: 0,
        y: 0,
      },
    };
  }

  render() {
    if (!this.context.contextMenuVisible) return <></>;
    return (
      <div
        style={{
          top: this.state.pos.y,
          left: this.state.pos.x,
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
