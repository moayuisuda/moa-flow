import Cell from "./Cell";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { FlowContext } from "../Context";

class Inspector extends Cell<{}, {}> {
  static contextType = FlowContext;

  render() {
    return (
      <Group x={20} y={20} draggable={true}>
        <Rect
          width={200}
          height={400}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
        ></Rect>
        <Text text="Inspector" />
        <Html>
          <div
            style={{
              width: 200,
              height: 400,
              overflow: "auto",
            }}
          >
            <pre>
              {JSON.stringify(this.context.model.canvasData, null, "\t")}
            </pre>
          </div>
        </Html>
      </Group>
    );
  }
}

export default Inspector;
