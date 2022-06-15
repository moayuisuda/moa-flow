import { useModel } from "@ali/flow-infra-g";
import type { IApi, IMeta, ISchema } from "@alipay/connect-util";
import {
  ProFormCascader,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
} from "@alipay/tech-ui";
import { Button, Form } from "antd";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { InterfaceNodeDataType } from "./InterfaceNode";
import ParamEditableTable from "./ParamsConfigTable";
import { FlowNodeConfig, IParamFront } from "./types";

const NodeConfigForm = ({
  interfaceSchema,
  id,
  onSave,
}: {
  id: string;
  interfaceSchema: ISchema;
  onSave: () => void;
}) => {
  const [form] = Form.useForm();
  const context = useModel();
  const data = lodash.cloneDeep(
    context.getCellData(id)
  ) as InterfaceNodeDataType;

  const [dataSource, setDataSource] = useState([
    {
      id: "1",
      desc: "描述1",
      name: "名称1",
      type: "String",
      assignmentType: "constant",
    },
    {
      id: "2",
      desc: "描述2",
      name: "名称2",
      type: "Number",
      assignmentType: "constant",
    },
    {
      id: "3",
      desc: "描述3",
      name: "名称3",
      type: "JSON",
      assignmentType: "constant",
    },
  ]);

  const mergeParams = () => {
    dataSource.forEach((source) => {
      const matchParam = data.inputParams.find((param) => {
        return source.id === param.id;
      });

      Object.assign(source, matchParam);
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      inputParams: data.inputParams,
      type: data.type,
      interface: data.interface,
      title: data.title,
    });
  }, [id]);

  useEffect(() => {
    mergeParams();
  }, [dataSource]);

  const saveNode = () => {
    form.validateFields().then((values) => {
      context.setCellData(id, values);
    });

    onSave();
  };

  return (
    <Form<FlowNodeConfig> form={form}>
      <ProFormGroup>
        <ProFormText name="title" label="节点名称" width="md" />
        <ProFormRadio.Group
          name="type"
          label="接口类型"
          width="md"
          options={[
            {
              label: "TR接口",
              value: "TR",
            },
            {
              label: "HTTP接口",
              value: "HTTP",
            },
          ]}
        />
      </ProFormGroup>
      <Form.Item noStyle dependencies={["type"]}>
        {({ getFieldValue }) => {
          const options = Object.keys(interfaceSchema.apis)
            ?.map((key) => {
              const apiSchema: IApi = interfaceSchema.apis[key];
              return {
                protocols: apiSchema.protocols as any,
                ...apiSchema.meta,
              };
            })
            .filter((api) => {
              const type = getFieldValue("type");
              if (type === "HTTP") {
                return !!api.protocols?.http;
              } else if (type === "TR") {
                return !!api.protocols?.tr;
              }
              return true;
            })
            .reduce(
              (
                prev: { value: string; label: string; children: any[] }[],
                curr: IMeta
              ) => {
                if (prev.find((item) => item.value === curr.namespace)) {
                  return prev.map((item) => {
                    if (item.value === curr.namespace) {
                      item.children.push({
                        ...curr,
                        value: curr.method,
                        label: `${curr.method}(${
                          curr.description?.split("@param")?.[0]
                        })`,
                      });
                    }
                    return item;
                  });
                } else {
                  return [
                    ...prev,
                    {
                      value: curr.namespace,
                      label: curr.namespace,
                      children: [
                        {
                          ...curr,
                          value: curr.method,
                          label: `${curr.method}(${
                            curr.description?.split("@param")?.[0]
                          })`,
                        },
                      ],
                    },
                  ];
                }
              },
              []
            );
          return (
            <ProFormCascader
              name="interface"
              label="接口"
              fieldProps={{
                options,
                showSearch: true,
              }}
            />
          );
        }}
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldsValue }) => {
          const { interface: selectInterface } = getFieldsValue();
          // const apiSchema: IApi = interfaceSchema.apis[selectInterface?.join('.')];
          // const parametersList = (apiSchema?.protocols?.http || apiSchema?.protocols?.tr)?.parameters;
          if (!interfaceSchema || !selectInterface?.length) {
            return null;
          }
          //   const inputParamsSchema: IParam[] =
          //     getInterfaceByName({
          //       schema: interfaceSchema,
          //       name: selectInterface?.join("."),
          //     })?.inputParams || [];

          //   const generateDataSource = (
          //     inputParam: IParam,
          //     valObj: IParamFront
          //   ) => {
          //     const valueLine: IParamFront = inputParams?.find(
          //       ({ id }) => id === item.id
          //     );
          //     return {
          //       id: inputParam.id,
          //       name: inputParam.title,
          //       desc: inputParam.description,
          //       type:
          //         inputParam.type ||
          //         (inputParam?.schema?.$ref?.split("/") || []).pop() ||
          //         inputParam?.schema?.type ||
          //         "",
          //       assignmentType: valueLine?.assignmentType || "constant",
          //       value: valueLine?.value || "",
          //       children: [],
          //     };
          //   };
          //   const dataSource = inputParamsSchema.map((item) => {
          //     return generateDataSource(item);
          //   });

          const changeParams = (params: IParamFront[]) => {
            setDataSource(params);
          };

          // const dataSource: IParamFront[] = parametersList?.map((item) => {
          //   const requestSchema = apiSchema.meta.request.find(({ id }) => id === item.id);
          //   const valueLine: IParamFront = inputParams?.find(({ id }) => id === item.id);
          //   return {
          //     id: requestSchema?.id || '',
          //     name: requestSchema?.title || '',
          //     desc: item.description || '',
          //     type: (requestSchema?.schema?.$ref?.split('/') || []).pop() || requestSchema?.schema?.type || '',
          //     assignmentType: valueLine?.assignmentType || 'constant',
          //     value: valueLine?.value || '',
          //     children: [{ id: '123' }],
          //   };
          // }) || [];

          return (
            <Form.Item label="入参" name="inputParams">
              <ParamEditableTable
                id={id}
                onChange={changeParams}
                dataSource={dataSource}
              />
            </Form.Item>
          );
        }}
      </Form.Item>

      <Button onClick={saveNode}>保存</Button>
    </Form>
  );
};

export default NodeConfigForm;
