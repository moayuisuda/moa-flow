import React from "react";
import { Card, Button, message, Divider } from "antd";
import { ModelType } from "flow";
import Command from "flow-matrix-command";

type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

const Controller = (props: { modelRef: ModelRefType }) => {
  const { modelRef } = props;
  const command = new Command(modelRef);

  return (
    <Card
      title="controller"
      style={{
        position: "fixed",
        left: 10,
        top: 10,
      }}
    >
      <Button
        danger
        onClick={() => {
          const { error, result } = command.dele();
          if (error) {
            message.warn(error.message);
          } else message.success(`删除 ${result} 成功`);
        }}
      >
        删除选择的节点
      </Button>
      <Divider />
      <Button
        danger
        onClick={() => {
          const { error, result } = command.deleEdges();
          if (error) {
            message.warn(error.message);
          } else message.success(`删除 ${result} 成功`);
        }}
      >
        删除选择节点的边
      </Button>
    </Card>
  );
};

export default Controller;
