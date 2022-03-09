import Cell from "./Cell";
import { Line } from "react-konva";

type EdgeType = {
  source: string;
  target: string;
};

class LinkingEdge extends Cell<
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

  getPoints() {
    const { model } = this.context;
    const { data } = this.props;

    const sourceInstance = model.cellsMap.get(data.source);

    const sourceAnchor =
      (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
      sourceInstance.anchor();
    const targetAnchor = model.buffer.link.target;

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
      <Line
        listening={false}
        stroke={color.deepGrey}
        points={this.getPoints()}
        strokeWidth={3}
        {...this.getStroke()}
        lineCap="round"
        bezier
        dash={[10, 10]}
      ></Line>
    );
  }

  content() {
    return <>{this.props.data.source && this.edgeRender()}</>;
  }
}

export default LinkingEdge;
