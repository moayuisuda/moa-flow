import React from "react";
export declare const ConsumerBridge: <T>(props: {
    context: React.Context<T>;
    children: (value: T) => React.ReactElement;
}) => React.ReactElement;
