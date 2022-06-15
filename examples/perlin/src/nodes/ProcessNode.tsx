import { Graph, Portal } from "@ali/flow-infra-g";
import { Input } from "antd";
import BaseNode from "./BaseNode";

const { Rect, Text, Circle, Image, Group } = Graph;

class ProcessNode extends BaseNode<{
  processSource: string;
}> {
  static metaData = {
    processSource: "return source",
  };
  // 执行实际的接口请求
  excute = async () => {
    const data = this.props.data;
    const source = this.context.getCell(this.getInNodes()[0])?.output();

    const runCodeWidthVariables = (str: string) => {
      const func = new Function(
        "source",
        "noise",
        `
          ${str}
      `
      );

      return func(source, noise);
    };

    return runCodeWidthVariables(data.processSource);
  };

  view() {
    const { color } = this.context;
    const { data } = this.props;
    const { width, height } = BaseNode.getBounds(data);

    return (
      <Portal x={20} y={40}>
        <Input.TextArea
          style={{
            width: 160,
            maxWidth: "none",
          }}
          defaultValue={data.processSource}
          onInput={(e) => {
            console.log("inputValue", e.currentTarget.value);
            this.setData({
              processSource: e.currentTarget.value,
            });
          }}
        />
      </Portal>
    );
  }
}

export default ProcessNode;