import React from "react";
import { Observer } from "mobx-react";
import { Group } from "@antv/react-g";
import { isUndefined } from "lodash";
import { CellDataType } from "../cells/Cell";
import G from "@antv/g";

export const Content = (props: {
  children: React.ReactNode;
  data: CellDataType;
  wrapperRef: {
    current: null | G.Group;
  };
}) => {
  return (
    <Observer>
      {() => (
        <Group
          ref={(ref) => {
            //@TODO 看看為什麼會重複觸發
            props.wrapperRef.current = ref;
          }}
        >
          {isUndefined(props.data.visible) || props.data.visible ? (
            <Group>{props.children}</Group>
          ) : (
            <></>
          )}
        </Group>
      )}
    </Observer>
  );
};
