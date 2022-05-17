import React from "react";
import { HTMLStyleProps } from "@antv/g";
export declare const Portal: ({ children, ...others }: Omit<HTMLStyleProps, "height" | "width" | "innerHTML"> & {
    children: React.ReactNode;
}) => JSX.Element;
