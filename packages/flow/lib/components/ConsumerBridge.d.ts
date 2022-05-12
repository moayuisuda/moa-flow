import React from "react";
declare const ConsumerBridge: <T>(props: {
    context: React.Context<T>;
    children: (value: T) => React.ReactElement;
}) => React.ReactElement;
export default ConsumerBridge;
