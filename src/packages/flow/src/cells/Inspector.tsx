import Cell from "./Cell";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { FlowContext } from "../Context";
import { observer } from "mobx-react";

@observer
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
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 100,
              }}
            ></div>
            <h1>Inspector</h1>
            <button
              onClick={() => {
                // model.canvasData.scale.x = 1;
                // model.canvasData.scale.y = 1;
                model.setScale(
                  model.canvasData.scale.x + 0.1,
                  model.canvasData.scale.y + 0.1
                );
              }}
            >
              scale +
            </button>
            <button
              onClick={() => {
                model.setScale(
                  model.canvasData.scale.x - 0.1,
                  model.canvasData.scale.y - 0.1
                );
              }}
            >
              scale -
            </button>
            <pre
              style={{
                width: 300,
                height: 280,
                overflow: "auto",
              }}
            >
              {JSON.stringify(this.context.model.canvasData, null, "\t")}
            </pre>
          </div>
        </Html>
      </Group>
    );
  }
}

export default Inspector;
