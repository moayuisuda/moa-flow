import React from "react";
import lodash from "lodash";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Table, TableColumnProps } from "antd";
import type { IParamFront } from "../../types";
import { Select, Input, Tooltip, Cascader } from "antd";
/** @ts-ignore */
import { getInterfaceByName } from '@alipay/connect-util';
import { useModel } from "@ali/flow-infra-g";
import { InterfaceNodeDataType, InterfacePortDataType } from "./types";

const ParamsConfigTable = ({
  onChange,
  dataSource,
  id,
}: {
  onChange?: (value: IParamFront[]) => void;
  dataSource: IParamFront[];
  id: string;
}) => {
  const handleValueChange = (dataIndex: string, path: string[], value: unknown) => {
    const newData = lodash.cloneDeep(dataSource);
    let tempValList = newData;
    path.forEach((pathItem: string, index: number) => {
      const findOne: any = tempValList.find(item => item.id === pathItem) as IParamFront;
      if (index === path.length - 1) {
        if (findOne) {
          findOne[dataIndex] = value;
          if (dataIndex === 'assignmentType') {
            findOne.value = '';
          }
        }
      } else {
        tempValList = findOne?.children || [];
      }
    })
    onChange?.(newData);
  }

  const context = useModel();
  const data = lodash.cloneDeep(
    context.getCellData(id)
  ) as InterfaceNodeDataType;
  const inPortData = data.ports.find(
    (portData) => portData.portType === "in"
  ) as InterfacePortDataType;
  const linkNodes = context
    .getPortLinkNodes(inPortData.id)
    .map((id) => context.getCellData(id)) as InterfaceNodeDataType[];

  const inputColumns: TableColumnProps<IParamFront>[] = [
    {
      title: "参数名称",
      dataIndex: "name",
      render: (text: string, record: IParamFront) => {
        return (
          <>
            {text}{" "}
            {record.desc ? (
              <Tooltip title={record.desc}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: "参数数据类型",
      dataIndex: "type",
    },
    {
      title: "参数赋值方式",
      width: 120,
      dataIndex: "assignmentType",
      render: (text: string, record: IParamFront,) => {
        const { path } = record;
        return (
          <Select
            size="small"
            value={text}
            bordered={false}
            onChange={(value) => {
              handleValueChange('assignmentType', path, value);
            }}
            options={[
              {
                label: "常量",
                value: "constant",
              },
              {
                label: "变量引用",
                value: "variable",
              },
            ]}
          />
        );
      },
    },
    {
      title: "值",
      dataIndex: "value",
      render: (text: string, record: IParamFront) => {
        const { path } = record;
        if (record.assignmentType === "constant") return (
          <Input
            onChange={(e) => handleValueChange('value', path, e.target.value)}
            value={text}
            bordered={false}
          />
        )
        else {
          const interfaceSchema = context.extra.interfaceSchema;
          type IDef = { definition: { title: string; type: string; properties: { [key: string]: IDef } }; title: string; id: string; type: string; };
          // (def: IDef) => { value: string; label: string; children: any[] | undefined }[]
          const getOutputParam: any = (def: IDef) => {
            console.log('moa-flow', 'def.definition', def, def.definition)
            return {
              value: def.definition?.title || def.id,
              label: def.definition?.title || def.title,
              children: ['object', 'array'].includes(def.definition?.type || def.type) ? Object.keys(def.definition?.properties || {}).map(childPropertyName => {
                const childProperty = def.definition?.properties?.[childPropertyName];
                return getOutputParam(childProperty);
              }) : undefined
            }
          }
          const options = linkNodes.filter(node => !!node.interface).map(nodeData => {
            const { interface: interfaceArr } = nodeData;
            const outputSchema = getInterfaceByName({ schema: interfaceSchema, name: interfaceArr.join('.') }).outputParam;
            return {
              ...getOutputParam(outputSchema),
              value: nodeData.id,
              label: `${nodeData.title}`,
            }
          });
          console.log('moa-flow', linkNodes, options);
          return <Cascader options={options} onChange={(e) => handleValueChange('value', path, e)} />
        }
      },
    },
  ];
  return (
    <Table<IParamFront>
      size="small"
      bordered={true}
      rowKey="id"
      pagination={false}
      columns={inputColumns}
      dataSource={dataSource}
    />
  );
};

export default ParamsConfigTable;
