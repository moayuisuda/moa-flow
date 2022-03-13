import Cell from "./Cell";
import { Line, Group, FastLayer } from "react-konva";
import Interactor from "../scaffold/Interactor";

type EdgeType = {
  source: string;
  target: string;
};

class Edge<P, S> extends Cell<
  EdgeType & P,
  {
    points: number[];
  } & S
> {
  static metaData: any = {
    type: "edge",
  };

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
    const isSelect = this.context.model.selectCells.includes(
      this.props.data.id
    );
    const { color } = this.context.model;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  protected getPoints() {
    const { model } = this.context;
    const { data } = this.props;

    const sourceInstance = model.cellsMap.get(data.source);
    const targetInstance = model.cellsMap.get(data.target);

    const sourceAnchor =
      (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
      sourceInstance.anchor();

    const targetAnchor =
      (targetInstance.props.anchor && targetInstance.props.anchor()) ||
      targetInstance.anchor();

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
    const { color } = this.context.model;
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
