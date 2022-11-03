import { useModel } from "@alipay/moa-flow";
import {
  ProFormCascader,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
} from "@alipay/tech-ui";
import { forwardRef, useImperativeHandle, useState } from "react";
// @ts-ignore
import type { IApi, IMeta, ISchema, IParam } from "@alipay/connect-util";
// @ts-ignore
import { getInterfaceByName, getMockInfo } from "@alipay/connect-util";
import { Form, Button } from "antd";
import lodash from "lodash";
import { useEffect } from "react";
import ParamEditableTable from "./ParamsConfigTable";
import { InterfaceNodeDataType } from "./types";
import { FlowNodeConfig, IParamFront } from "../../types";

const NodeConfigForm = forwardRef(
  (
    {
      interfaceSchema,
      id,
    }: {
      id: string;
      interfaceSchema: ISchema;
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [sceneOptions, setSceneOptions] = useState<
      { label: string; value: string }[]
    >([]);
    const context = useModel();
    const data = lodash.cloneDeep(
      context.getCellData(id)
    ) as InterfaceNodeDataType;

    useEffect(() => {
      if (id) {
        const { appId, tagName: tag } = interfaceSchema;
        const interfaceInfo = getInterfaceByName({
          schema: interfaceSchema,
          name: data.interface?.join("."),
        });
        const { path, method } =
          interfaceInfo?.protocols?.http || interfaceInfo?.protocols?.tr || {};

        getMockInfo({ appId, tag, path, method }).then(
          (res: { success: boolean; data: any[] }) => {
            if (res?.success) {
              setSceneOptions(
                res.data?.map((item) => ({
                  value: item.scene,
                  label: item.scene,
                }))
              );
            }
          }
        );
      }
      form.setFieldsValue(data);
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
        <ProFormSwitch name="enableMock" label="是否开启Mock" />
        {
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const enableMock = getFieldValue("enableMock");
              if (enableMock)
                return (
                  <ProFormSelect
                    options={sceneOptions}
                    name="scene"
                    label="oneapi Mock场景"
                    width={200}
                    extra={
                      <Button
                        type="link"
                        onClick={() =>
                          window.open(
                            `https://oneapi.alipay.com/app/cinspfront/tag/doc/master?method=DisposalEntityController.uploadEntityRelationFile&mock=newMockScene&source=ZAPPINFO`
                          )
                        }
                      >
                        新建mock场景
                      </Button>
                    }
                  />
                );
              return null;
            }}
          </Form.Item>
        }

        <Form.Item noStyle shouldUpdate>
          {({ getFieldsValue }) => {
            const { interface: selectInterface, inputParams = [] } =
              getFieldsValue();
            if (!interfaceSchema || !selectInterface?.length) {
              return null;
            }
            const inputParamsSchema: IParam[] =
              getInterfaceByName({
                schema: interfaceSchema,
                name: selectInterface?.join("."),
              })?.inputParams || [];
            const generateDataSource: any = (
              inputParam: IParam,
              valueLine: IParamFront,
              parentPath: string[]
            ) => {
              const children: IParamFront[] | undefined = [
                "object",
                "array",
              ].includes(inputParam.definition?.type)
                ? Object.keys(inputParam.definition?.properties || {}).map(
                    (childPropertyName) => {
                      const childProperty =
                        inputParam.definition?.properties?.[childPropertyName];
                      return generateDataSource(
                        childProperty,
                        valueLine?.children?.find(
                          (item) => item.id === childProperty.id
                        ) as IParamFront,
                        [...parentPath, inputParam.id]
                      );
                    }
                  )
                : undefined;
              return {
                id: inputParam.id,
                path: [...parentPath, inputParam.id],
                name: inputParam.title,
                desc: inputParam.description,
                type:
                  inputParam.type ||
                  (inputParam?.schema?.$ref?.split("/") || []).pop() ||
                  inputParam?.schema?.type ||
                  "",
                assignmentType: valueLine?.assignmentType || "constant",
                value: valueLine?.value || "",
                children: children,
              };
            };
            const dataSource = inputParamsSchema.map((item) => {
              return generateDataSource(
                item,
                inputParams.find(({ id }: IParamFront) => id === item.id),
                []
              );
            });
            return (
              <Form.Item label="入参" name="inputParams">
                <ParamEditableTable
                  id={id}
                  // onChange={changeParams}
                  dataSource={dataSource}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
    );
  }
);

export default NodeConfigForm;
