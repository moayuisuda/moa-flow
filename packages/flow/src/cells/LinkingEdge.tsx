import Edge from "@/cells/Edge";
import { Group } from "react-konva";

class LinkingEdge extends Edge<{}, {}> {
  protected dash: boolean = true;

  getPoints() {
    const { context } = this;
    const { data } = this.props;

    const sourceInstance = context.cellsMap.get(data.source);

    const sourceAnchor =
      (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
      sourceInstance.anchor();
    // || sourceInstance.anchor();
    const targetAnchor = context.buffer.link.target;

    return this.route(sourceAnchor, targetAnchor);
  }

  // 一般不会重写这个方法
  content() {
    return (
      <Group listening={false}>
        {this.props.data.source && this.edgeRender(this.getPoints())}
      </Group>
    );
  }
}

export default LinkingEdge;
