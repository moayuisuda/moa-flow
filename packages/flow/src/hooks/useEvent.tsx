import { useModel } from "./useModel";
import { useState, useLayoutEffect } from "react";
import { v4 } from "uuid";

export const useEvent = (cb: Function, cellId: string) => {
  // local id
  const [id] = useState(v4());
  const context = useModel();

  useLayoutEffect(() => {
    const eventMap = context.eventMap;
    const events = context.eventMap.get(cellId);
    if (events) {
      events.set(id, cb);
    } else eventMap.set(cellId, new Map([[id, cb]]));

    console.log("eventMap", { eventMap });
  }, [id]);
};
