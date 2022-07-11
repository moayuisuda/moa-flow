import { Portal, Graph, ModelType } from "@ali/flow-infra-g";
import { BaseNodeDataType } from "../BaseNode";
import { HANG_FLAG } from "../../constants";
import { Input, Modal } from "antd";
import BaseNode from "../BaseNode";
import { createRef } from "react";
import NodeConfigForm from "./ProcessConfigForm";

const { Group, Text, Rect } = Graph;
export type ProcessNodeDataType = {
  processSource: string;
} & BaseNodeDataType;

class ProcessNode extends BaseNode<
  ProcessNodeDataType,
  { modalVisible: boolean }
> {
  static metaData = {
    processSource: "success(source)",
  };

  formRef: React.RefObject<{
    submit: Function;
  }>;

  constructor(props: { data: ProcessNodeDataType }, context: ModelType) {
    super(props, context);

    this.state = {
      modalVisible: false,
    };

    this.formRef = createRef();
  }
  // 执行实际的接口请求
  excute = async () => {
    const data = this.getData();
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
      let isExcuteExplicit = false;
      let reRef = { value: undefined as any };

      const success = (e: any) => {
        isExcuteExplicit = true;
        reRef.value = e;
      };

      const error = (e: any) => {
        isExcuteExplicit = true;
        reRef.value = Promise.reject(e);
      };

      const hang = () => {
        isExcuteExplicit = true;
        reRef.value = Promise.resolve(HANG_FLAG);
      };

      const func = new Function(
        "source, success, error, hang",
        `
          ${str}
      `
      );

      func(source, success, error, hang);
      // 如果没有显式调用任何一个方法，则置为hang
      if (!isExcuteExplicit) return HANG_FLAG;
      else return reRef.value;
    };

    return runCodeWithVariables(data.processSource);
  };

  width: number = 360;
  height: number = 160;

  view() {
    const { data } = this.props;
    const { width } = this;

    return (
      <Group>
        <Group
          // @ts-ignore
          x={width}
          cursor="pointer"
          onClick={() => this.setState({ modalVisible: true })}
        >
          <Rect
            width={40}
            height={40}
            radius={[0, 4, 4, 0]}
            fill={this.context.color.active}
          ></Rect>
          <Text
            y={20}
            x={8}
            textBaseline="middle"
            fill="white"
            text={"Edit"}
            fontSize={12}
          />
        </Group>

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

          <Modal
            title={data.id}
            destroyOnClose
            visible={this.state.modalVisible}
            width={800}
            onOk={async () => {
              await this.formRef.current?.submit();
              this.setState({
                modalVisible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                modalVisible: false,
              });
            }}
          >
            <NodeConfigForm ref={this.formRef} id={data.id} />
          </Modal>
        </Portal>
      </Group>
    );
  }
}

export default ProcessNode;
