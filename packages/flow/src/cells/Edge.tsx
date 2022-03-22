import Cell from "./Cell";
import { Line, Group } from "react-konva";
import Interactor from "../scaffold/Interactor";
import { observer } from "mobx-react";
import { CellType } from "./Cell";

export type EdgeType = {
  source: string;
  target: string;
} & CellType;

class Edge<P, S> extends Cell<
  EdgeType & P,
  {
    points: number[];
  } & S
> {
  static metaData: any = {
    type: "edge",
  };

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

    this.state = {
      points: [],
    } as {
      points: number[];
    } & S;
  }

  private getStroke = () => {
    const isSelect = this.flowState.isSelect;
    const { color } = this.context;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  protected getPoints() {
    const { data } = this.props;

    const sourceInstance = this.context.cellsMap.get(data.source);
    const targetInstance = this.context.cellsMap.get(data.target);

    const sourceAnchor =
      sourceInstance.props.anchor && sourceInstance.props.anchor();
    // || sourceInstance.anchor();

    const targetAnchor =
      targetInstance.props.anchor && targetInstance.props.anchor();
    // || targetInstance.anchor();

    return this.route(sourceAnchor, targetAnchor);
  }

  // 这个方法暴露出去，可自定义路由
  route(sourceAnchor, targetAnchor) {
    const MIDDLE = (sourceAnchor.x + targetAnchor.x) / 2;

    return [
      sourceAnchor.x,
      sourceAnchor.y,

      MIDDLE,
      sourceAnchor.y,

      MIDDLE,
      targetAnchor.y,

      targetAnchor.x,
      targetAnchor.y,
    ];
  }

  protected edgeRender() {
    const { color } = this.context;
    const points = this.getPoints();

    return (
      <Group>
        <Line
          stroke={color.deepGrey}
          points={points}
          strokeWidth={3}
          {...this.getStroke()}
          lineCap="round"
          bezier={this.bazier}
          dash={this.dash ? [10, 10] : undefined}
        ></Line>
        <Line
          stroke="transparent"
          points={points}
          strokeWidth={20}
          lineCap="round"
          bezier={this.bazier}
        ></Line>
      </Group>
    );
  }

  content() {
    return (
      <Interactor id={this.props.data.id} draggable={false}>
        {this.edgeRender()}
      </Interactor>
    );
  }
}

export default Edge;
