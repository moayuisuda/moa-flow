import { FlowContext } from "../Context";
import { useContext } from "react";

export const useFlowModel = () => {
  return useContext(FlowContext);
};
