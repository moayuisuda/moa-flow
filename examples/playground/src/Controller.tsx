import React from "react";
import { Card, Button, message } from "antd";
import { ModelType } from "flow";

type ModelRefType = React.MutableRefObject<ModelType | undefined | null>;

const Controller = (props: { modelRef: ModelRefType }) => {
  const { modelRef } = props;
  const commander = Command(modelRef);

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
          if (!modelRef.current?.selectCells[0]) message.warn("请先选择元素");
          else commander.dele();
        }}
      >
        删除
      </Button>
    </Card>
  );
};

const Command = (modelRef: ModelRefType) => {
  return {
    dele: () => {
      modelRef.current?.deleCell(modelRef.current?.selectCells[0]);
    },
  };
};

export default Controller;
