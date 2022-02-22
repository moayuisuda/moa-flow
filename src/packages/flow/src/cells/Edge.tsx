import Cell from "./Cell";
import { Group, Line } from "react-konva";
import _ from "lodash";
import { color } from "../global/style";
import { observer } from "mobx-react";
import Interactor from "../scaffold/Interactor";

type EdgeType = {
  source: string;
  target: string;
};

@observer
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

    if (isSelect) {
      return {
        stroke: color.orange,
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

  render() {
    return (
      <Group>
        <Interactor id={this.props.id} draggable={false}>
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
        </Interactor>
      </Group>
    );
  }
}

export default Edge;
