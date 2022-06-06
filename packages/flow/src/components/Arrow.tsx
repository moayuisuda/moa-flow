import type { DisplayObject, BaseStyleProps } from "@antv/g";
import * as G from "@antv/g";
import { isBoolean } from "lodash";
import { vec3 } from "gl-matrix";
import { Path, Line, Polyline, Group } from "@antv/react-g";
import React, { Component } from "react";

type ArrowHead = boolean | DisplayObject;
export interface ArrowStyleProps extends React.ReactElement {
  path: string;
  startHead?: ArrowHead;
  endHead?: ArrowHead;
  stroke?: string;
  lineWidth?: number;
  opacity?: number;
  strokeOpacity?: number;
}

const ARROW_SIZE = 16;

/**
 * support 3 types of arrow line:
 * 1. Line
 * 2. Polyline
 * 3. Path
 *
 * support 2 types of arrow head:
 * 1. default(Path)
 * 2. custom
 */
export class Arrow extends Component<ArrowStyleProps, {}> {
  startRef: React.MutableRefObject<DisplayObject | null>;
  endRef: React.MutableRefObject<DisplayObject | null>;
  bodyRef: React.MutableRefObject<DisplayObject | null>;

  constructor(props: ArrowStyleProps) {
    super(props);

    this.startRef = React.createRef();
    this.endRef = React.createRef();
    this.bodyRef = React.createRef();
  }

  getArrowHead(head: ArrowHead, isStart: boolean) {
    if (isBoolean(head)) {
      return this.getDefaultArrowHead();
    } else {
      return isStart ? this.props.startHead : this.props.endHead;
    }
  }

  setHeadTransform() {
    console.log("get");
    const { startHead, endHead } = this.props;

    startHead &&
      this.transformArrowHead(this.startRef.current as DisplayObject, true);

    endHead &&
      this.transformArrowHead(this.endRef.current as DisplayObject, false);
  }

  componentDidMount() {
    this.setHeadTransform();
  }
  componentDidUpdate() {
    this.setHeadTransform();
  }

  render() {
    const { startHead, endHead, ...others } = this.props;

    return (
      <Group>
        <Path {...others} ref={this.bodyRef} />
        {startHead && (
          <Group ref={this.startRef}>
            {this.getArrowHead(startHead, true)}
          </Group>
        )}
        {endHead && (
          <Group ref={this.endRef}>{this.getArrowHead(endHead, false)}</Group>
        )}
      </Group>
    );
  }

  getCenter() {
    const points = (this.bodyRef.current as G.Polyline).getPoint(0.5);
    return points;
  }

  /**
   * transform arrow head according to arrow line
   */
  private transformArrowHead(head: DisplayObject, isStart: boolean) {
    let position = vec3.create();
    let rad = 0;
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;

    {
      const [p1, p2] = this.getTangent(this.bodyRef.current as G.Path, isStart);
      x1 = p1[0];
      y1 = p1[1];
      x2 = p2[0];
      y2 = p2[1];
      console.log("p1p2", p1, p2);
    }

    const x = x1 - x2;
    const y = y1 - y2;
    rad = Math.atan2(y, x);
    position = vec3.fromValues(x2, y2, 0);

    head.setLocalPosition(position);
    head.setLocalEulerAngles((rad * 180) / Math.PI);
  }

  private getTangent(path: G.Path, isStart: boolean): number[][] {
    return isStart ? path.getStartTangent() : path.getEndTangent();
  }

  private getDefaultArrowHead() {
    const { startHead, endHead, ...others } = this.props;
    const { sin, cos, PI } = Math;
    return (
      <Path
        {...others}
        lineDash={undefined}
        fill={this.props.stroke}
        path={`M${ARROW_SIZE * cos(PI / 6)},${ARROW_SIZE * sin(PI / 6)} L0,0 L${
          ARROW_SIZE * cos(PI / 6)
        },-${ARROW_SIZE * sin(PI / 6)} Z`}
      />
    );
  }
}
