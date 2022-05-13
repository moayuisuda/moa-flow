import React from "react";
import { HTMLStyleProps } from "@antv/g";
export declare const Portal: ({ children, ...others }: Omit<HTMLStyleProps, "innerHTML" | "width" | "height"> & {
    children: React.ReactElement;
}) => JSX.Element;
