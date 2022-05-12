import React from "react";
import { Canvas } from "../Flow";
import RightClickPanel from "../components/RightClickPanel";

export const getElement = (
  children: React.ReactNode[] | React.ReactNode,
  type: JSX.IntrinsicElements | React.JSXElementConstructor<any>
) => {
  const childrenArray = React.Children.toArray(children);

  return childrenArray.find((item: { type }) => {
    return item.type === type;
  });
};

export const getCanvas = (children: React.ReactNode[] | React.ReactNode) => {
  const childrenArray = React.Children.toArray(children);

  return childrenArray.find((item: { type }) => {
    const innerChildren = React.Children.toArray(item.props.children);
    if (innerChildren[0]?.type === Canvas || item.type === Canvas) return item;
  });
};
