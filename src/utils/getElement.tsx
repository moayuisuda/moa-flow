import React from "react";

export const getElement = (
  children: React.ReactNode[] | React.ReactNode,
  type: JSX.IntrinsicElements | React.JSXElementConstructor<any>
) => {
  const childrenArray = React.Children.toArray(children);

  return childrenArray.find((item: any) => {
    return item.type === type;
  });
};
