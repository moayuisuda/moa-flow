import BaseNode, {
    BaseNodeDataType,
    BasePortDataType,
} from "../BaseNode";
import { FlowNodeConfig } from "../../types";

export type InterfaceNodeDataType = BaseNodeDataType & FlowNodeConfig;
export type InterfacePortDataType = BasePortDataType;