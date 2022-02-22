import Cell from "./Cell";
import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { FlowContext } from "../Context";
import { observer } from "mobx-react";
import { Button, Space, Divider, message, Typography } from "antd";
import React from "react";
import Interactor from "../scaffold/Interactor";

const { Title } = Typography;

@observer
class Inspector extends Cell<
  {
    x: number;
    y: number;
  },
  {}
> {
  static contextType = FlowContext;
  metaConfigRef;

  constructor(props, context) {
    super(props, context);

    this.metaConfigRef = React.createRef();
  }

  render() {
    const { model } = this.context;

    return (
      <Interactor {...this.props} selectable={false}>
        <Rect
          width={300}
          height={400}
          fill="white"
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.2}
          cornerRadius={10}
        />
        <Text
          width={300}
          height={60}
          x={20}
          verticalAlign="middle"
          text="Inspector 🔍"
          fontSize={30}
          fontFamily="mono"
        />
        <Group y={40}>
          <Html>
            <div
              style={{
                width: 300,
                height: 340,
                padding: 20,
                overflow: "auto",
              }}
            >
              <Space>
                <Button
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
                </Button>
                <Button
                  onClick={() => {
                    model.setScale(
                      model.canvasData.scale.x - 0.1,
                      model.canvasData.scale.y - 0.1
                    );
                  }}
                >
                  scale -
                </Button>
              </Space>

              <Divider></Divider>

              <Title level={4}>select cell</Title>
              {model.selectCells}

              <Divider></Divider>

              <Space>
                <Button
                  size="small"
                  onClick={() => {
                    const text = this.metaConfigRef.current.innerText;
                    let newData;
                    try {
                      newData = JSON.parse(text);
                      model.setCanvasData(newData);
                    } catch {
                      message.error("data invalid");
                    }
                  }}
                >
                  SAVE
                </Button>
                <Title level={4}>meta json</Title>
              </Space>
              <pre contentEditable={true} ref={this.metaConfigRef}>
                {JSON.stringify(this.context.model.canvasData, null, "\t")}
              </pre>
            </div>
          </Html>
        </Group>
      </Interactor>
    );
  }
}

export default Inspector;
