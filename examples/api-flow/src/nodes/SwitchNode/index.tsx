import { Portal, Graph } from "@ali/flow-infra-g";
import { Input, Form } from "antd";
import BaseNode from "../BaseNode";

const { Group, Text, Rect } = Graph;

class ProcessNode extends BaseNode<{
  processSource: string;
}> {
  static metaData = {
    processSource: "return source",
  };
  // 执行实际的接口请求
  excute = async () => {
    const data = this.props.data;
    const inNodes = this.getInNodes();
    let source: any;

    if (inNodes) {
      if (inNodes.length === 1)
        source = this.context.getCell(this.getInNodes()[0])?.output();
      else {
        /* 如果是多数据源聚合为下面这种形式
        {
          0: 'data1',
          2: 'data2'
        }
        */
        let re: Record<string, any> = {};
        source = this.getInNodes().forEach((nodeId) => {
          re[nodeId] = this.context.getCell(nodeId)?.output();
        });

        source = re;
      }
    }

    const runCodeWithVariables = (str: string) => {
      const func = new Function(
        "source",
        `
          ${str}
      `
      );

      return func(source);
    };

    return runCodeWithVariables(data.processSource);
  };

  width: number = 360;
  height: number = 160;

  view() {
    const { color } = this.context;
    const { data } = this.props;
    const { width, height } = this;

    return (
      <Group>
        <Portal x={20} y={50}>
          <Input.TextArea
            style={{
              width: 320,
              minHeight: 100,
              maxWidth: "none",
            }}
            defaultValue={data.processSource}
            onInput={(e) => {
              this.setData({
                processSource: e.currentTarget.value,
              });
            }}
          />
        </Portal>
      </Group>
    );
  }
}

export default ProcessNode;
