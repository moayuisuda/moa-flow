import { Graph } from "@ali/flow-infra-g";
import { isUndefined } from "lodash";
import BaseNode from "./BaseNode";

const { Rect, Text, Circle, Image, Group } = Graph;

class BlockNode extends BaseNode<{}> {
  static metaData = {};

  excute = async () => {
    const data = this.props.data;

    return;
  };

  view() {
    const source = this.context.getCell(this.getInNodes()[0])?.output();
    const inValue = isUndefined(source) ? 0 : source;
    console.log({ cell: this.context.getCell(this.getInNodes()[0]), inValue });
    const gray = Math.abs(inValue * 255);

    return (
      // @ts-ignore
      <Group y={60} x={30}>
        <Text text={String(Math.abs(inValue))} />
        <Rect
          y={10}
          width={80}
          height={20}
          fill={`rgba(${gray}, ${gray}, ${gray})`}
        />
      </Group>
    );
  }
}

export default BlockNode;
