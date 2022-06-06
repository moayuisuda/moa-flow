import { FlowContext } from "../Context";
import { useContext } from "react";

export const useModel = () => {
  return useContext(FlowContext);
};
