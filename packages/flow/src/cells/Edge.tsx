import Cell, { CellDataType } from "./Cell";
import { NodeDataType } from "./Node";
import FlowModel from "../Model";
import { Group, Text, Rect } from "@antv/react-g";
import { Dir, Vector2d } from "../typings/common";
import { Interactor, Arrow, PortDataType } from "../components";
import React from "react";
import { isVector2d, lineCenter, titleCase } from "../utils";
import { InteractivePointerEvent } from "@antv/g";
import * as G from "@antv/g";
import type { DisplayObject } from "@antv/g";
import { callIfFn } from "../utils/util";
import { autorun } from "mobx";

export type EdgeDataType = {
  source: string | Vector2d;
  target: string | Vector2d;
  label: string;
  verticies?: Vector2d[];
} & CellDataType;
const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;

type Head = React.ReactNode | boolean;
abstract class Edge<P = {}, S = {}> extends Cell<EdgeDataType & P, {} & S> {
  static metaData: any = {
    cellType: "edge",
  };
  labelRef: React.RefObject<G.Group>;
  arrowRef: React.RefObject<Arrow>;

  protected bazier: boolean | (() => boolean) = false;
  protected startHead: Head | (() => Head) = false;
  protected endhead: Head | (() => Head) = true;
  protected lineDash: [number, number] | (() => [number, number]) = [0, 0];
  protected animate: boolean | (() => boolean) = false;

  pathInstance = new G.Path();

  isMountEvents = false;

  constructor(
    props: {
      data: EdgeDataType;
    },
    context: FlowModel
  ) {
    super(props, context);
    this.labelRef = React.createRef();
    this.arrowRef = React.createRef();
  }

  initAnimate() {
    if (callIfFn(this.animate)) {
      const lineDash = callIfFn(this.lineDash);
      const LENGTH = lineDash[0] + lineDash[1];
      (this.arrowRef.current?.bodyRef.current as DisplayObject)?.animate?.(
        [{ lineDashOffset: LENGTH }, { lineDashOffset: 0 }],
        {
          duration: 500,
          iterations: Infinity,
        }
      );
    }
  }

  componentDidMount(): void {
    super.componentDidMount();

    autorun(() => {
      if (this.props.data.visible === true) {
        requestAnimationFrame(() => {
          // 确保didUpdate之后再设置动画
          this.initAnimate();
        });
      }
    });
  }

  protected lineStyle({ isSelect }: { isSelect: boolean }) {
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  }

  protected formatVerticied = (verticies: Vector2d[]) => {
    return verticies;
  };

  getLinkPortsData = () => {
    return {
      source: isVector2d(this.props.data.source)
        ? (this.props.data.source as Vector2d)
        : (this.context.cellsDataMap.get(
            this.props.data.source as string
          ) as PortDataType),
      target: isVector2d(this.props.data.target)
        ? (this.props.data.target as Vector2d)
        : (this.context.cellsDataMap.get(
            this.props.data.target as string
          ) as PortDataType),
    };
  };

  getAnchors = () => {
    const { data } = this.props;
    let sourceAnchor;
    let targetAnchor;

    if (isVector2d(data.source)) sourceAnchor = data.source;
    else {
      const sourceInstance = this.context.cellsMap.get(data.source as string);
      sourceAnchor = sourceInstance.anchor();
    }
    if (isVector2d(data.target)) targetAnchor = data.target;
    else {
      const targetInstance = this.context.cellsMap.get(data.target as string);
      targetAnchor = targetInstance.anchor();
    }

    return {
      source: sourceAnchor,
      target: targetAnchor,
    };
  };

  private getPoints() {
    const routeResult = this.route(this.getVectors());

    return this.vectorsToPoints(routeResult);
  }

  getVectors() {
    const anchors = this.getAnchors();
    const verticies = this.props.data.verticies || [];

    return [anchors.source, ...verticies, anchors.target];
  }

  getLinkNodesData() {
    const { data } = this.props;
    let source;
    let target;

    if (!isVector2d(data.source)) {
      const sourcePort = this.context.cellsDataMap.get(
        data.source as string
      ) as PortDataType;
      source = this.context.cellsDataMap.get(
        sourcePort.host as string
      ) as NodeDataType;
    }

    if (!isVector2d(data.target)) {
      const targetPort = this.context.cellsDataMap.get(
        data.target as string
      ) as PortDataType;
      target = this.context.cellsDataMap.get(
        targetPort.host as string
      ) as NodeDataType;
    }

    return {
      source,
      target,
    };
  }

  // 这个方法暴露出去，可自定义路由
  protected route(vectors: Vector2d[]) {
    return vectors;
  }

  private vectorsToPoints(vectors: Vector2d[]) {
    const re: [number, number][] = [];
    vectors.forEach((vector) => {
      re.push([vector.x, vector.y]);
    });

    return re;
  }

  labelContent() {
    const {
      color,
      refs: { stageRef },
    } = this.context;

    const text = this.labelFormatter(this.props.data.label);
    if (!text) return <></>;

    const props = {
      text,
      textBaseline: "top" as "top",
      ...this.labelStyle(),
    };
    const textInstance = new G.Text({
      style: props,
    });

    stageRef?.current?.appendChild(textInstance);
    const textBounds = textInstance.getBBox();
    stageRef?.current?.removeChild(textInstance);

    return (
      <Group
        x={-(textBounds.width + LABEL_PADDING) / 2}
        y={-(TEXT_HEIGHT + LABEL_PADDING) / 2}
      >
        <Rect
          width={textBounds.width + LABEL_PADDING * 2}
          height={TEXT_HEIGHT + LABEL_PADDING * 2}
          fill="white"
        ></Rect>
        <Text x={LABEL_PADDING} y={LABEL_PADDING} {...props} />
      </Group>
    );
  }

  labelStyle() {
    return {};
  }

  labelPosition() {
    if (callIfFn(this.bazier)) {
      this.pathInstance.style.setProperty("path", this.getBazierPath());

      return this.pathInstance.getPoint(0.5);
    } else {
      const points = this.getVectors().map((vector) => [
        vector.x,
        vector.y,
      ]) as [number, number][];
      const lineLenthCenter = lineCenter(points);

      return {
        x: lineLenthCenter[0] || points[0][0],
        y: lineLenthCenter[1] || points[0][1],
      };
    }
  }

  protected labelRender() {
    const text = this.labelFormatter(this.props.data.label);

    return (
      <Group
        ref={(label) => {
          if (this.isMountEvents || !label) return;

          [
            "mouseenter",
            "mouseleave",
            "mousedown",
            "mouseup",
            "dblclick",
            "click",
          ].forEach((eventName) => {
            label.on(eventName, (e: InteractivePointerEvent) => {
              const instanceEventFn = this[`onLabel${titleCase(eventName)}`];
              instanceEventFn && instanceEventFn.call(this, e);

              this.context.emitEvent({
                type: `label:${eventName}`,
                data: {
                  e,
                  cellData: this.props.data,
                  cell: this,
                },
              });
            });
          });

          this.isMountEvents = true;
        }}
        {...this.labelPosition()}
      >
        {text && this.labelContent()}
      </Group>
    );
  }

  labelFormatter(label: string) {
    return label;
  }

  isLinking() {
    return this.props.data.$state.isLinking;
  }

  getBazierDir(): { source: Dir; target: Dir } {
    const { source, target } = this.getAnchors();
    const LENGTH = (target.x - source.x) * 0.5;

    return {
      source: [LENGTH, 0],
      target: [-LENGTH, 0],
    };
  }

  getBazierPath() {
    const { source, target } = this.getAnchors();
    const dir = this.getBazierDir();

    return `M${source.x},${source.y} 
    C${source.x + dir.source[0]},${source.y + dir.source[1]} ${
      target.x + dir.target[0]
    },${target.y + dir.target[1]} 
    ${target.x},${target.y}`;
  }

  getPolylinePath() {
    const points = this.getPoints();

    let str = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      str += `L${points[i][0]},${points[i][1]}`;
    }

    return str;
  }

  getPath() {
    return callIfFn(this.bazier)
      ? this.getBazierPath()
      : this.getPolylinePath();
  }

  lineExtra: () => JSX.Element;

  protected edgeRender() {
    const { color } = this.context;

    const lineProps = {
      lineCap: "round",
      lineJoin: "round",
      lineWidth: 3,
      stroke: color.deepGrey,
      ...this.lineStyle({ isSelect: this.isSelect() }),
    } as any;

    return (
      <Group>
        <Arrow
          ref={this.arrowRef}
          {...lineProps}
          path={this.getPath()}
          startHead={callIfFn(this.startHead)}
          endHead={callIfFn(this.endhead)}
          lineDash={callIfFn(this.lineDash)}
        />
      </Group>
    );
  }

  content() {
    return (
      <Interactor id={this.props.data.id} draggable={false}>
        {this.edgeRender()}
        {this.labelRender()}
        {this.lineExtra && this.lineExtra()}
      </Interactor>
    );
  }
}

export default Edge;
