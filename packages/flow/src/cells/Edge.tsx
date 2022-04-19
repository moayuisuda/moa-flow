import Cell from "./Cell";
import { Line, Group, Label, Text, Tag } from "react-konva";
import Interactor from "../scaffold/Interactor";
import { CellType } from "./Cell";
import { NodeFlowState } from "../types/common";
import { PortType } from "../scaffold/Port";
import React from "react";
import Konva from "konva";
import { NodeType } from "./Node";
import { isVector2d } from "../utils/util";

export type EdgeType = {
  source: string | Konva.Vector2d;
  target: string | Konva.Vector2d;
  label: string;
  verticies?: Konva.Vector2d[];
} & CellType;
const TEXT_HEIGHT = 16;
const LABEL_PADDING = 4;
abstract class Edge<P = {}, S = {}> extends Cell<
  EdgeType & P,
  {
    points: number[];
  } & S
> {
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
  protected dash = false;

  constructor(props, context) {
    super(props, context);
    this.labelRef = React.createRef();

    this.state = {
      points: [],
    } as {
      points: number[];
    } & S;
  }

  protected getStroke = (flowState: NodeFlowState) => {
    const { isSelect } = flowState;
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  protected formatVerticied = (verticies) => {
    return verticies;
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
      ) as PortType;
      source = this.context.cellsDataMap.get(sourcePort.host) as NodeType;
    }

    if (!isVector2d(data.target)) {
      const targetPort = this.context.cellsDataMap.get(
        data.target as string
      ) as PortType;
      target = this.context.cellsDataMap.get(targetPort.host) as NodeType;
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

  private vectorsToPoints(vectors) {
    const re = [];
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

    const text = this.labelFormatter(this.props.data.label);
    const textWidth = linesLayerRef.current
      .getContext()
      .measureText(text).width;

    return (
      <Label
        x={-textWidth / 2 - LABEL_PADDING}
        y={-TEXT_HEIGHT / 2}
        onClick={(e) => {
          this.context.sendEvent({
            type: "label:click",
            data: this,
          });
        }}
      >
        <Tag fill={color.background} />
        <Text
          height={TEXT_HEIGHT}
          verticalAlign="middle"
          text={this.labelFormatter(this.props.data.label)}
          padding={LABEL_PADDING}
        />
      </Label>
    );
  }

  protected labelRender(anchors) {
    const text = this.labelFormatter(this.props.data.label);

    return (
      <Group
        ref={(label) => {
          if (!label) return;

          [
            "mouseenter",
            "mouseleave",
            "mousedown",
            "mouseup",
            "dblclick",
            "click",
          ].forEach((eventName) => {
            label.on(eventName, (e) => {
              this.context.sendEvent({
                type: `label:${eventName}`,
                data: {
                  e,
                  cellData: this.props.data,
                },
              });
            });
          });
        }}
        x={(anchors.source.x + anchors.target.x) / 2}
        y={(anchors.source.y + anchors.target.y) / 2}
      >
        {text && this.labelContent()}
      </Group>
    );
  }

  labelFormatter(label) {
    return label;
  }

  isLinking() {
    return this.context.buffer.link.edge === this.props.data.id;
  }

  lineExtra: () => JSX.Element;

  protected edgeRender({ points, isLinking }) {
    const { color } = this.context;

    return (
      <Group>
        <Line
          stroke={color.deepGrey}
          points={points}
          strokeWidth={3}
          {...this.getStroke(this.flowState)}
          lineCap="round"
          dash={isLinking ? [10, 10] : undefined}
        ></Line>
        <Line
          stroke="transparent"
          points={points}
          strokeWidth={20}
          lineCap="round"
        ></Line>
        {this.lineExtra && this.lineExtra()}
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
        {this.labelRender(this.getAnchors())}
      </Interactor>
    );
  }
}

export default Edge;
