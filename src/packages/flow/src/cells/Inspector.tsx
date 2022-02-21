import Cell from "./Cell";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { FlowContext } from "../Context";
import DragWrapper from "../scaffold/DragWrapper";

class Inspector extends Cell<{}, {}> {
  static contextType = FlowContext;

  render() {
    const { model } = this.context;

    return (
      <Group x={20} y={20}>
        <Rect
          width={300}
          height={400}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
        />
        <Html>
          <div
            style={{
              width: 300,
              height: 400,
              overflow: "auto",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 100,
              }}
            >
              <button
                onClick={() => {
                  // model.canvasData.scale.x = 1;
                  // model.canvasData.scale.y = 1;
                  model.canvasData.scale = {
                    x: model.canvasData.scale.x + 0.1,
                    y: model.canvasData.scale.y + 0.1,
                  };
                }}
              >
                +
              </button>
              <button
                onClick={() => {
                  model.canvasData.scale = {
                    x: model.canvasData.scale.x - 0.1,
                    y: model.canvasData.scale.y - 0.1,
                  };
                }}
              >
                -
              </button>
            </div>
            <pre>
              {JSON.stringify(this.context.model.canvasData, null, "\t")}
            </pre>
          </div>
        </Html>
        <Text text="Inspector" />
      </Group>
    );
  }
}

export default Inspector;
