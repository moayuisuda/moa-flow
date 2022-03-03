import Cell from "./Cell";
import { Line } from "react-konva";
import Interactor from "../scaffold/Interactor";

type EdgeType = {
  source: string;
  target: string;
};

class Edge extends Cell<
  EdgeType,
  {
    points: number[];
  }
> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      points: [],
    };
  }

  getStroke = () => {
    const isSelect = this.context.model.selectCells.includes(this.props.id);
    const { color } = this.context.model;

    if (isSelect) {
      return {
        stroke: color.active,
      };
    } else return {};
  };

  getPoints() {
    const { model } = this.context;

    const sourceAnchor = model.cellsMap.get(this.props.source).props.anchor();
    const targetAnchor = model.cellsMap.get(this.props.target).props.anchor();

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

  edgeRender() {
    const { color } = this.context.model;

    return (
      <>
        <Line
          stroke={color.deepGrey}
          points={this.getPoints()}
          strokeWidth={3}
          {...this.getStroke()}
          lineCap="round"
          bezier
        ></Line>
        <Line
          stroke="transparent"
          points={this.getPoints()}
          strokeWidth={20}
          lineCap="round"
          bezier
        ></Line>
      </>
    );
  }

  content() {
    return (
      <Interactor id={this.props.id} draggable={false}>
        {this.edgeRender()}
      </Interactor>
    );
  }
}

export default Edge;
