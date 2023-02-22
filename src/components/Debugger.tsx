import { observer } from "mobx-react";
import { useFlowModel } from "../hooks/useFlowModel";
import { PortalWrapper } from "./PortalWrapper";
import React from "react";

export const Debugger = observer(() => {
  const context = useFlowModel();
  return (
    <pre
      style={{
        height: 800,
        overflow: "auto",
        backgroundColor: "white",
        padding: 4,
        fontSize: 8,
        border: "1px solid black",
      }}
    >
      {JSON.stringify(context.canvasData, null, 2)}
    </pre>
  );
});
