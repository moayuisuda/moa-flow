import { observer } from "mobx-react";
import styles from "./style.less";
import * as G from "@antv/g";
import React from "react";
import { FlowContext } from "../../Context";
import Model from "../../Model";
import { EVT_RIGHTCLICK, STAGE_CLASS_NAME } from "../../constants";

@observer
class RightClickPanel extends React.Component<
  {
    stage?: G.Canvas;
    extra?: (context: Model) => React.ReactNode;
  },
  { pos: { x: number; y: number } }
> {
  static contextType = FlowContext;

  initStageEvent = () => {
    document
      .querySelector("#" + STAGE_CLASS_NAME)
      ?.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.context.buffer.rightClickPanel.visible = true;

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

  constructor(props) {
    super(props);

    this.state = {
      pos: {
        x: 0,
        y: 0,
      },
    };
  }

  dele() {}

  moveToTop() {}

  render() {
    if (!this.context.buffer.rightClickPanel.visible) return <></>;
    return (
      <div
        style={{
          top: this.state.pos.y,
          left: this.state.pos.x,
        }}
        className={styles["toolbar"]}
      >
        {this.props.children(this.context)}
      </div>
    );
  }
}

export const getRightClickPanel = (
  children: React.ReactNode[] | React.ReactNode
) => {
  return React.Children.toArray(children).find((item: { type }) => {
    return item.type === RightClickPanel;
  });
};

export default RightClickPanel;
