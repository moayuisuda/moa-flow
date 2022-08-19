import { useModel } from "@ali/moa-flow";
import { Input } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import lodash from "lodash";
import { useEffect } from "react";
import { ProcessNodeDataType } from "./index";

const NodeConfigForm = forwardRef(
  (
    {
      id,
    }: {
      id: string;
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const context = useModel();
    const data = lodash.cloneDeep(
      context.getCellData(id)
    ) as ProcessNodeDataType;

    useEffect(() => {
      form.setFieldsValue({
        processSource: data.processSource,
        title: data.title,
      });
    }, [id]);

    const saveNode = () => {
      return form.validateFields().then((values) => {
        context.setCellData(id, values);
      });
    };

    useImperativeHandle(ref, () => ({
      submit: saveNode,
    }));

    return (
      <Form form={form}>
        <Form.Item name="title" label="节点名称">
          <Input></Input>
        </Form.Item>
        <Form.Item name={"processSource"} label="执行代码">
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    );
  }
);

export default NodeConfigForm;
