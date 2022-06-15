import React from "react";
import lodash from "lodash";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Table, TableColumnProps } from "antd";
import type { IParamFront } from "./types";
import { Select, Input, Tooltip } from "antd";
import { useModel } from "@ali/flow-infra-g";
import { InterfaceNodeDataType, InterfacePortDataType } from "./InterfaceNode";

const ParamsConfigTable = ({
  onChange,
  dataSource,
  id,
}: {
  onChange: (value: IParamFront[]) => void;
  dataSource: IParamFront[];
  id: string;
}) => {
  const handleValueChange = (
    dataIndex: string,
    row: number,
    value: unknown
  ) => {
    const newData = lodash.cloneDeep(dataSource);
    newData[row][dataIndex] = value;
    onChange(newData);
  };

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
      render: (text: string, _, index: number) => {
        return (
          <Select
            size="small"
            value={text}
            bordered={false}
            onChange={(value) =>
              handleValueChange("assignmentType", index, value)
            }
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
      render: (text: string, record: IParamFront, index: number) => {
        return record.assignmentType === "constant" ? (
          <Input
            onChange={(e) => handleValueChange("value", index, e.target.value)}
            value={text}
            bordered={false}
          />
        ) : (
          <Select
            value={text}
            onChange={(value) => handleValueChange("value", index, value)}
          >
            {linkNodes.map((nodeData) => (
              <Select.Option key={nodeData?.id} value={nodeData.id}>
                {nodeData.title}
              </Select.Option>
            ))}
          </Select>
        );
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
