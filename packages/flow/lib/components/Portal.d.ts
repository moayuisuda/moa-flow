import React from "react";
import { HTMLStyleProps } from "@antv/react-g";
export declare const HTML: ({ children, ...others }: Omit<HTMLStyleProps, "innerHTML"> & {
    children: React.ReactElement;
}) => JSX.Element;
