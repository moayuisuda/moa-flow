import React from "react";
import { HTMLStyleProps } from "@antv/g";
declare const Portal: ({ children, ...others }: Omit<HTMLStyleProps, "innerHTML"> & {
    children: React.ReactElement;
}) => JSX.Element;
export default Portal;
