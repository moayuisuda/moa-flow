import Cell from "./Cell";
import { Group, Line } from "react-konva";
import _ from "lodash";
import { color } from "../global/style";
import { observer } from "mobx-react";

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
      <Group
        onClick={(e) => {
          this.context.onClick({
            event: e,
            cell: this,
          });
        }}
      >
        <Line
          stroke={color.deepGrey}
          points={this.getPoints()}
          strokeWidth={3}
          lineCap="round"
          bezier
        ></Line>
      </Group>
    );
  }
}

export default Edge;
