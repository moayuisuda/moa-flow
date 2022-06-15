import { Graph, Interactor, Portal } from "@ali/flow-infra-g";
import { Slider } from "antd";
import BaseNode from "./BaseNode";

const { Rect, Text, Circle, Image, Group } = Graph;
const { Port } = Interactor;

class InputNode extends BaseNode<{}> {
  static metaData: any = {
    cacheData: 0,
    value: 0,
  };

  excute = async () => {
    const data = this.props.data;

    return data.value;
  };

  view() {
    const { data } = this.props;
    const { ports } = data;

    const inPorts =
      ports?.filter((portData) => portData.portType === "in") || [];
    const outPorts =
      ports?.filter((portData) => portData.portType === "out") || [];

    const position = this.getPosition();

    return (
      <Group>
        <Portal x={30} y={55}>
          <Slider
            style={{ width: 120 }}
            value={data.value}
            onChange={(e) =>
              this.setData({
                value: e,
              })
            }
          ></Slider>
        </Portal>
      </Group>
    );
  }
}

export default InputNode;
