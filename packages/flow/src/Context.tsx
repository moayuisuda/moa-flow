import React from "react";

export type FlowContextType = {
  model: any;
};

export const FlowContext = React.createContext<FlowContextType>(null);
