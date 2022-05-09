import Cell from "./Cell";
import { Polyline, Group, Text } from "@antv/react-g";
import * as G from "@antv/g";
import Interactor from "../scaffold/Interacotr";
import { CellDataType } from "./Cell";
import { PortDataType } from "../scaffold/Port";
import React from "react";
import { NodeDataType } from "./Node";
import { isVector2d } from "../utils/util";
import FlowModel from "../Model";
import { titleCase } from "utils/string";
import { lineCenter } from "utils/vector";
import { isFunction } from "lodash";
import ErrorBoundary from "../ErrorBoundary";
import { Vector2d } from "../types/common";

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

  protected bazier = true;
  protected arrow = false;
  protected dash = false;

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
      source = this.context.cellsDataMap.get(sourcePort.host) as NodeDataType;
    }

    if (!isVector2d(data.target)) {
      const targetPort = this.context.cellsDataMap.get(
        data.target as string
      ) as PortDataType;
      target = this.context.cellsDataMap.get(targetPort.host) as NodeDataType;
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
      refs: { linesLayerRef },
    } = this.context;

    const text = this.labelFormatter(this.props.data.label);
    const textWidth = linesLayerRef.current
      .getContext()
      .measureText(text).width;

    return (
      <Group x={-textWidth / 2 - LABEL_PADDING} y={-TEXT_HEIGHT / 2}>
        <Text
          // height={TEXT_HEIGHT}
          // verticalAlign="middle"
          text={this.labelFormatter(this.props.data.label)}
          // padding={LABEL_PADDING}
          {...this.labelStyle()}
        />
      </Group>
    );
  }

  labelStyle() {
    return {};
  }

  labelPosition() {
    const points = this.getVectors().map((vector) => [vector.x, vector.y]);
    const lineLenthCenter = lineCenter(points);

    return {
      x: lineLenthCenter[0],
      y: lineLenthCenter[1],
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
            label.on(eventName, (e) => {
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
      lineWidth: 2.5,
      points: points as [number, number][],
      stroke: color.deepGrey,
      fill: color.deepGrey,
      dash: isLinking ? [10, 10] : undefined,
      ...this.lineStyle({ isSelect: this.isSelect() }),
    } as any;

    return (
      <Group>
        {this.arrow ? (
          // <Arrow {...lineProps} pointerWidth={10} />
          <Text text="asdasd" />
        ) : (
          <Polyline {...lineProps} />
        )}
        <Polyline
          stroke="transparent"
          points={points}
          lineWidth={20}
          lineCap="round"
          lineJoin="round"
        ></Polyline>
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
        {/* TODO */}
        {/* {this.labelRender()} */}
        {this.lineExtra && this.lineExtra()}
      </Interactor>
    );
  }
}

export default Edge;
