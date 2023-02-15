import { observer } from "mobx-react";
import styles from "./style.module.less";
import React, { createRef } from "react";
import { FlowContext } from "../../Context";
import { STAGE_ID } from "../../constants";

export const CONTEXT_MENU_ID = "moa-context-menu";
@observer
class ContextMenu extends React.Component<{ children?: React.ReactNode }> {
  static contextType = FlowContext;
  wrapperRef = createRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);
  }

  isOutClient() {
    const re = {
      x: false,
      y: false,
    };

    const { x, y } = this.context.buffer.contextMenu;

    const containerDom = this.wrapperRef.current as HTMLDivElement;
    const stageDom = document.getElementById(STAGE_ID) as HTMLDivElement;
    const style = getComputedStyle(containerDom);
    const stageBox = stageDom.getBoundingClientRect();

    if (parseFloat(style.height) + y > stageBox.bottom) {
      re.y = true;
    }

    if (parseFloat(style.width) + x > stageBox.right) {
      re.x = true;
    }

    return re;
  }

  setTransform() {
    const isOutClient = this.isOutClient();
    const containerDom = this.wrapperRef.current as HTMLDivElement;
    let transformStr = "";

    if (isOutClient.x) {
      transformStr += "translateX(-100%)";
    }
    if (isOutClient.y) {
      transformStr += " translateY(-100%)";
    }

    containerDom.style.transform = transformStr;
  }

  componentDidMount() {
    const context = this.context;
    if (this.wrapperRef.current) this.setTransform();
    document
      .querySelector("#" + STAGE_ID)
      ?.addEventListener("contextmenu", (e: Event) => {
        e.preventDefault();
        context.contextMenuVisible = true;

        context.setContextMenuPos({
          x: (e as any).clientX + 5,
          y: (e as any).clientY + 5,
        });
      });
  }

  componentDidUpdate() {
    if (this.wrapperRef.current) this.setTransform();
  }

  render() {
    if (!this.context.contextMenuVisible) return <></>;
    const { x, y } = this.context.buffer.contextMenu;
    return (
      <div
        id={CONTEXT_MENU_ID}
        style={{
          left: x,
          top: y,
          position: "fixed",
          zIndex: 5,
        }}
        ref={this.wrapperRef}
      >
        {this.props.children}
      </div>
    );
  }
}

export { ContextMenu };
