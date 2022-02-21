import Cell, { CellType } from "./Cell";
import { Group, Line } from "react-konva";
import _ from "lodash";

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

  getPoints() {
    const { model } = this.context;

    const sourceAnchor = model.cellsMap.get(this.props.source).props.anchor();
    const targetAnchor = model.cellsMap.get(this.props.target).props.anchor();
    this.setState({
      points: [sourceAnchor.x, sourceAnchor.y, targetAnchor.x, targetAnchor.y],
    });
  }

  shouldComponentUpdate(
    nextProps: Readonly<EdgeType & CellType>,
    nextState: Readonly<{ points: number[] }>,
    nextContext: any
  ): boolean {
    if (!this.state.points.length) return true;
    return !_.isEqual(this.props, nextProps);
  }

  componentDidMount(): void {
    this.getPoints();
  }

  componentDidUpdate(
    prevProps: Readonly<EdgeType & CellType>,
    prevState: Readonly<{ points: number[] }>,
    snapshot?: any
  ): void {
    this.getPoints();
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
        <Line stroke={"black"} points={this.state.points} tension={1}></Line>
      </Group>
    );
  }
}

export default Edge;
