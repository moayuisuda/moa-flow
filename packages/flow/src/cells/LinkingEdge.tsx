import Edge from "@/cells/Edge";
import { Group } from "react-konva";

class LinkingEdge extends Edge<{}, {}> {
  getPoints() {
    const { model } = this.context;
    const { data } = this.props;

    const sourceInstance = model.cellsMap.get(data.source);

    const sourceAnchor =
      (sourceInstance.props.anchor && sourceInstance.props.anchor()) ||
      sourceInstance.anchor();
    const targetAnchor = model.buffer.link.target;

    return this.route(sourceAnchor, targetAnchor);
  }

  // 一般不会重写这个方法
  content() {
    return (
      <Group listening={false}>
        {this.props.data.source && this.edgeRender()}
      </Group>
    );
  }
}

export default LinkingEdge;
