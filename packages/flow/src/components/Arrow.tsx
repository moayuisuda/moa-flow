import type { DisplayObject, PathStyleProps } from "@antv/g";
import { isBoolean } from "lodash";
import React, { Component } from "react";
import { v4 } from "uuid";

type ArrowHead = boolean | React.ReactNode;
export interface ArrowStyleProps extends PathStyleProps {
  path: string;
  startHead?: ArrowHead;
  endHead?: ArrowHead;
}

const DEFAULT_ARROW_SIZE = 16;
export class Arrow extends Component<ArrowStyleProps, {}> {
  id: string;
  constructor(props: ArrowStyleProps) {
    super(props);
    this.id = v4();
  }

  getArrowHead(head: ArrowHead, isStart: boolean) {
    let headInstance;

    if (isBoolean(head)) {
      headInstance = this.getDefaultArrowHead();
    } else {
      headInstance = isStart ? this.props.startHead : this.props.endHead;
    }

    return (
      <defs>
        <marker
          id={this.getHeadId(isStart)}
          viewBox="-10 -10 20 20"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          {headInstance}
        </marker>
      </defs>
    );
  }

  getHeadId(isStart: boolean) {
    return this.id + isStart ? "START" : "END";
  }

  render() {
    const { startHead, endHead, ...others } = this.props;

    return (
      <g>
        {startHead && this.getArrowHead(startHead, true)}
        {endHead && this.getArrowHead(endHead, false)}
        <path
          markerStart={`url(#${this.getHeadId(true)})`}
          markerEnd={`url(#${this.getHeadId(false)})`}
          {...others}
        />
      </g>
    );
  }

  private getDefaultArrowHead() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { startHead, endHead, ...others } = this.props;
    const { sin, cos, PI } = Math;
    return (
      <path
        {...others}
        lineDash={undefined}
        fill={this.props.stroke}
        path={`M-${DEFAULT_ARROW_SIZE * cos(PI / 6)},${
          DEFAULT_ARROW_SIZE * sin(PI / 6)
        } L0,0 L-${DEFAULT_ARROW_SIZE * cos(PI / 6)},-${
          DEFAULT_ARROW_SIZE * sin(PI / 6)
        } Z`}
      />
    );
  }
}
