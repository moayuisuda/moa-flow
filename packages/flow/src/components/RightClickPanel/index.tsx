import { observer } from "mobx-react";
import styles from "./style.less";
import Konva from "konva";
import React from "react";
import { FlowContext } from "@/Context";
import Model from "@/Model";

@observer
class RightClickPanel extends React.Component<
  {
    stage?: Konva.Stage;
    extra?: (context: Model) => React.ReactNode;
  },
  { pos: { x: number; y: number } }
> {
  static contextType = FlowContext;

  initStageEvent = () => {
    this.context.refs.stageRef.current.on("contextmenu", (e) => {
      e.evt.preventDefault();
      this.context.buffer.rightClickPanel.visible = true;

      this.setState({
        pos: {
          x: e.evt.clientX,
          y: e.evt.clientY,
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
    const { extra } = this.props;
    if (!this.context.buffer.rightClickPanel.visible) return <></>;
    return (
      <ul
        style={{
          top: this.state.pos.y,
          left: this.state.pos.x,
        }}
        className={styles["toolbar"]}
      >
        {/* <button
          className={styles["toolbar__button"]}
          onClick={() => this.dele()}
        >
          删除
        </button>
        <button
          className={styles["toolbar__button"]}
          onClick={() => this.dele()}
        >
          移到顶层
        </button> */}
        {extra && extra(this.context)}
      </ul>
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
