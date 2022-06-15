import { useModel } from './useModel.js';
import { useState, useLayoutEffect } from 'react';
import v4 from '../packages/flow/node_modules/uuid/dist/esm-browser/v4.js';

var useEvent = function (cb, cellId) {
    // local id
    var id = useState(v4())[0];
    var context = useModel();
    useLayoutEffect(function () {
        var eventMap = context.eventMap;
        var events = context.eventMap.get(cellId);
        if (events) {
            events.set(id, cb);
        }
        else
            eventMap.set(cellId, new Map([[id, cb]]));
        console.log("eventMap", { eventMap: eventMap });
    }, [id]);
};

export { useEvent };
