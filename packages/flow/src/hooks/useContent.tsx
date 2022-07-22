import React from "react";
import { Observer } from "mobx-react";
import { isUndefined } from "lodash";
import { CellDataType } from "../cells/Cell";

export const Content = (props: {
  children: React.ReactNode;
  data: CellDataType;
  wrapperRef: {
    current: null | HTMLElement;
  };
}) => {
  return (
    <Observer>
      {() => (
        <div
          ref={(ref) => {
            //@TODO 看看為什麼會重複觸發
            props.wrapperRef.current = ref;
          }}
        >
          {isUndefined(props.data.visible) || props.data.visible ? (
            props.children
          ) : (
            <></>
          )}
        </div>
      )}
    </Observer>
  );
};
