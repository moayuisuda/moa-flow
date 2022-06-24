import React from "react";
import { Group } from "@antv/react-g";
import { CellDataType } from "../cells/Cell";
import G from "@antv/g";
export declare const Content: (props: {
    children: React.ReactNode;
    data: CellDataType;
    wrapperRef: {
        current: null | G.Group;
    };
}) => JSX.Element;
