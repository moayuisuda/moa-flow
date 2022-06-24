import React from "react";

const interfaceSchema = {};
const globalData = {
  interfaceSchema,
};

export const Context = React.createContext(globalData);
