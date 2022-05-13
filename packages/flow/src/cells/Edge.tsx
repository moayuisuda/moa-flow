import Cell, { CellDataType } from "./Cell";
import { NodeDataType } from "./Node";
import FlowModel from "../Model";
import { Group, Text, Rect } from "@antv/react-g";
import { Vector2d } from "../typings/common";
import { Interactor, Arrow, PortDataType } from "../components";
import React from "react";
import { isVector2d, lineCenter, titleCase } from "../utils";
import { InteractivePointerEvent } from "@antv/g";
import * as G from "@antv/g";

export type EdgeDataType = {
  source: string | Vector2d;
  target: string | Vector2d;
  label: string;
  verticies?: Vector2d[];
} & CellDataType;
const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;
abstract class Edge<P = {}, S = {}> extends Cell<EdgeDataType & P, {} & S> {
  static metaData: any = {
    cellType: "edge",
  };
  labelRef: React.RefObject<G.Group>;

  protected bazier = false;
  protected arrow = false;

  isMountEvents = false;

  constructor(
    props: {
      data: EdgeDataType;
    },
    context: FlowModel
  ) {
    super(props, context);
    this.labelRef = React.createRef();
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
    const points = this.getVectors().map((vector) => [vector.x, vector.y]) as [
      number,
      number
    ][];
    const lineLenthCenter = lineCenter(points);

    return {
      x: lineLenthCenter[0] || points[0][0],
      y: lineLenthCenter[1] || points[0][1],
    };
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

              this.context.sendEvent({
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

  getBazierPath() {
    const { source, target } = this.getAnchors();
    const LENGTH = (source.x - target.x) * 0.5;

    return `M${source.x},${source.y} 
    C${source.x - LENGTH},${source.y} ${target.x + LENGTH},${target.y} 
    ${target.x},${target.y}`;
  }

  lineExtra: () => JSX.Element;

  protected edgeRender({
    points,
    isLinking,
  }: {
    points: [number, number][];
    isLinking: boolean;
  }) {
    const { color } = this.context;

    const lineProps = {
      lineCap: "round",
      lineJoin: "round",
      lineWidth: 3,
      stroke: color.deepGrey,
      ...this.lineStyle({ isSelect: this.isSelect() }),
    } as any;

    const bazierProps = {
      type: "Path",
      path: this.getBazierPath(),
    };

    const polyLineProps = {
      type: "Polyline",
      points,
    };

    return (
      <Group>
        <Arrow
          {...(this.bazier ? bazierProps : polyLineProps)}
          points={points}
          {...lineProps}
          endHead={true}
        />
      </Group>
    );
  }

  content() {
    return (
      <Interactor id={this.props.data.id} draggable={false}>
        {this.edgeRender({
          points: this.getPoints(),
          isLinking: this.isLinking(),
        })}
        {this.labelRender()}
        {this.lineExtra && this.lineExtra()}
      </Interactor>
    );
  }
}

export default Edge;
