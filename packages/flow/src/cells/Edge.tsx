import Cell from "./Cell";
import { Line, Group, Label, Text, Tag, Arrow } from "react-konva";
import Interactor from "../scaffold/Interactor";
import { CellDataType } from "./Cell";
import { PortDataType } from "../scaffold/Port";
import React from "react";
import Konva from "konva";
import { NodeDataType } from "./Node";
import { isVector2d } from "../utils/util";
import { Vector2d } from "konva/lib/types";
import FlowModel from "../Model";
import { titleCase } from "utils/string";
import { lineCenter } from "utils/vector";

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
  labelRef: React.RefObject<Konva.Group>;

  // // 先不管线条的bounds
  // static getBounds(cellData) {
  //   const sourceInstance = flowModel.cellsMap.get(cellData.source);
  //   const targetInstance = flowModel.cellsMap.get(cellData.target);

  //   const sourceAnchor =
  //     sourceInstance.props.anchor && sourceInstance.props.anchor();
  //   // || sourceInstance.anchor();

  //   const targetAnchor =
  //     targetInstance.props.anchor && targetInstance.props.anchor();

  //   const left = Math.min(sourceAnchor.x, targetAnchor.x);
  //   const right = Math.max(sourceAnchor.x, targetAnchor.x);
  //   const top = Math.min(sourceAnchor.y, targetAnchor.y);
  //   const bottom = Math.max(sourceAnchor.y, targetAnchor.y);

  //   return {
  //     width: right - left,
  //     height: bottom - top,
  //     x: left,
  //     y: top,
  //   };
  // }

  protected bazier = true;
  protected arrow = true;
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

  onMount = () => {
    this.labelRef.current;
  };

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
      sourceAnchor =
        (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
        sourceInstance.anchor();
    }
    if (isVector2d(data.target)) targetAnchor = data.target;
    else {
      const targetInstance = this.context.cellsMap.get(data.target as string);
      targetAnchor =
        (targetInstance.props.anchor && targetInstance.props.anchor()) ||
        targetInstance.anchor();
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
  protected route(vectors: Konva.Vector2d[]) {
    return vectors;
  }

  private vectorsToPoints(vectors: Vector2d[]) {
    const re: number[] = [];
    vectors.forEach((vector) => {
      re.push(vector.x, vector.y);
    });

    return re;
  }

  labelContent() {
    const {
      color,
      refs: { linesLayerRef },
    } = this.context;

    console.log(this.context);
    const text = this.labelFormatter(this.props.data.label);
    const textWidth = linesLayerRef.current
      .getContext()
      .measureText(text).width;

    return (
      <Label x={-textWidth / 2 - LABEL_PADDING} y={-TEXT_HEIGHT / 2}>
        <Tag fill={color.background} />
        <Text
          height={TEXT_HEIGHT}
          verticalAlign="middle"
          text={this.labelFormatter(this.props.data.label)}
          padding={LABEL_PADDING}
          {...this.labelStyle()}
        />
      </Label>
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
    return this.context.buffer.link.edge === this.props.data.id;
  }

  lineExtra: () => JSX.Element;

  protected edgeRender({
    points,
    isLinking,
  }: {
    points: number[];
    isLinking: boolean;
  }) {
    const { color } = this.context;

    const lineProps = {
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 2.5,
      points: points as number[],
      stroke: color.deepGrey,
      fill: color.deepGrey,
      dash: isLinking ? [10, 10] : undefined,
      ...this.lineStyle({ isSelect: this.isSelect() }),
    } as any;

    return (
      <Group>
        {this.arrow ? (
          <Arrow {...lineProps} pointerWidth={10} />
        ) : (
          <Line {...lineProps} />
        )}
        <Line
          stroke="transparent"
          points={points}
          strokeWidth={20}
          lineCap="round"
          lineJoin="round"
        ></Line>
      </Group>
    );
  }

  content() {
    return (
      <Interactor id={this.props.data.id} draggable={false} topOnFocus={true}>
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
